import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Search,
  Filter,
  Package,
  Layers,
  CheckCircle,
  X,
  History,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory, MovementType } from '../../types';

export const InventoryModule: React.FC = () => {
  const { products, movements, addProduct, addStockMovement, criticalStockCount } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'movements'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCritical, setOnlyCritical] = useState(false);

  // Modals state
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Movement Form
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [movementType, setMovementType] = useState<MovementType>('entry');
  const [movementQty, setMovementQty] = useState<number>(1);
  const [movementReason, setMovementReason] = useState<string>('Compra a proveedor');
  const [movementResponsible, setMovementResponsible] = useState<string>('Romel Montes');
  const [movementServiceId, setMovementServiceId] = useState<string>('');

  // New Product Form
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Químicos');
  const [newProdUnit, setNewProdUnit] = useState('Litros');
  const [newProdStock, setNewProdStock] = useState<number>(10);
  const [newProdMinStock, setNewProdMinStock] = useState<number>(5);
  const [newProdLocation, setNewProdLocation] = useState('');

  // Filtering
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCritical = !onlyCritical || prod.currentStock <= prod.minStock;
    return matchesCategory && matchesSearch && matchesCritical;
  });

  const handleOpenMovementModal = (productId?: string, type: MovementType = 'entry') => {
    if (productId) setSelectedProductId(productId);
    setMovementType(type);
    setMovementReason(type === 'entry' ? 'Compra de reposición' : 'Asignación a servicio');
    setIsMovementModalOpen(true);
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || movementQty <= 0) return;

    addStockMovement({
      productId: selectedProductId,
      type: movementType,
      quantity: Number(movementQty),
      reason: movementReason,
      responsible: movementResponsible || 'Romel Montes',
      serviceId: movementServiceId || undefined,
    });

    setIsMovementModalOpen(false);
    setMovementQty(1);
    setMovementServiceId('');
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addProduct({
      name: newProdName.trim(),
      sku: newProdSku.trim() || `ECO-${Math.floor(100 + Math.random() * 900)}`,
      category: newProdCategory,
      unit: newProdUnit,
      currentStock: Number(newProdStock),
      minStock: Number(newProdMinStock),
      location: newProdLocation.trim() || 'Bodega Central',
    });

    setIsNewProductModalOpen(false);
    setNewProdName('');
    setNewProdSku('');
    setNewProdStock(10);
    setNewProdMinStock(5);
    setNewProdLocation('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            Inventario de Insumos
          </h1>
          <p className="text-sm text-black/70 mt-1">
            Control de químicos, herramientas y consumibles con alertas automáticas de stock crítico.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenMovementModal()}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 text-white" />
            <span>Registrar Entrada / Salida</span>
          </button>
          <button
            onClick={() => setIsNewProductModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-black border border-slate-200 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Nuevo Insumo</span>
          </button>
        </div>
      </div>

      {/* Subtabs: Catálogo vs Historial de Movimientos */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'catalog'
              ? 'bg-sky-100 text-sky-800'
              : 'text-black/70 hover:text-black hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Catálogo de Productos ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('movements')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'movements'
              ? 'bg-sky-100 text-sky-800'
              : 'text-black/70 hover:text-black hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historial de Movimientos ({movements.length})</span>
        </button>
      </div>

      {activeSubTab === 'catalog' ? (
        <>
          {/* Categorías y Filtros */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Buscador */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, químico, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-black placeholder:text-slate-400"
                />
              </div>

              {/* Categorías tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['all', 'Químicos', 'Herramientas', 'Consumibles'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-slate-100 text-black/70 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'Todos los Insumos' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle de Alerta Stock Crítico */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyCritical}
                  onChange={(e) => setOnlyCritical(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded-md border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
                <span className="font-semibold text-black/80 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  Filtrar solo productos en nivel crítico ({criticalStockCount})
                </span>
              </label>

              <span className="text-black/70">
                Mostrando {filteredProducts.length} de {products.length} productos
              </span>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => {
              const isCritical = prod.currentStock <= prod.minStock;
              const stockPercent = Math.min(
                100,
                Math.round((prod.currentStock / prod.minStock) * 100)
              );

              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition flex flex-col justify-between ${
                    isCritical
                      ? 'border-rose-300 bg-rose-50/15 ring-1 ring-rose-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Badge Category & Critical Alert */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-black/80">
                          {prod.category}
                        </span>
                        <span className="text-[11px] font-mono text-black/70">{prod.sku}</span>
                      </div>
                      {isCritical && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Stock Crítico
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-black mt-1 leading-snug">{prod.name}</h3>
                    {prod.location && (
                      <p className="text-xs text-black/70 mt-1 flex items-center gap-1">
                        <span className="font-semibold text-slate-500">Ubicación:</span>
                        <span>{prod.location}</span>
                      </p>
                    )}

                    {/* Stock Numbers */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-black/70 font-semibold uppercase">
                          Stock Disponible
                        </div>
                        <div
                          className={`text-2xl font-black ${
                            isCritical ? 'text-rose-600' : 'text-black'
                          }`}
                        >
                          {prod.currentStock}{' '}
                          <span className="text-xs font-semibold text-black/70">{prod.unit}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] text-black/70 font-semibold uppercase">
                          Stock Mínimo
                        </div>
                        <div className="text-base font-bold text-black/80">
                          {prod.minStock}{' '}
                          <span className="text-xs font-normal text-black/70">{prod.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Barra Visual */}
                    <div className="mt-3">
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCritical ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${stockPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenMovementModal(prod.id, 'entry')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition cursor-pointer"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>+ Entrada</span>
                    </button>
                    <button
                      onClick={() => handleOpenMovementModal(prod.id, 'exit')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>- Salida</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Historial de Movimientos */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-black">
              Registro de Entradas (Compras) y Salidas (Asignaciones)
            </h3>
            <span className="text-xs text-black/70 font-semibold">
              Total movimientos: {movements.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-black/70 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Cantidad</th>
                  <th className="py-3 px-4">Motivo / Servicio</th>
                  <th className="py-3 px-4">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-xs font-mono text-black/70 whitespace-nowrap">
                      {mov.date}
                    </td>
                    <td className="py-3 px-4">
                      {mov.type === 'entry' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Entrada (Compra)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Salida (Servicio)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-black">{mov.productName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-sm">
                      {mov.type === 'entry' ? `+${mov.quantity}` : `-${mov.quantity}`}
                    </td>
                    <td className="py-3 px-4 text-xs text-black/80">
                      <div>{mov.reason}</div>
                      {mov.serviceId && (
                        <div className="text-[11px] text-sky-700 font-medium">
                          Ref: {mov.serviceId}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-black/70">
                      {mov.responsible}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Registrar Entrada o Salida */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-black">
                {movementType === 'entry' ? 'Registrar Entrada de Insumo' : 'Registrar Salida de Insumo'}
              </h3>
              <button
                onClick={() => setIsMovementModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovement} className="space-y-4 mt-4">
              {/* Tipo de Movimiento Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMovementType('entry')}
                  className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    movementType === 'entry'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-black/70 hover:text-black'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  Entrada (Compra/Reposición)
                </button>
                <button
                  type="button"
                  onClick={() => setMovementType('exit')}
                  className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    movementType === 'exit'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-black/70 hover:text-black'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Salida (Asignación/Consumo)
                </button>
              </div>

              {/* Producto */}
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Producto / Insumo
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.category}] {p.name} — Actual: {p.currentStock} {p.unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Cantidad a mover
                </label>
                <input
                  type="number"
                  min="1"
                  value={movementQty}
                  onChange={(e) => setMovementQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Motivo o Descripción
                </label>
                <input
                  type="text"
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  placeholder="Ej. Compra factura 4920, Asignación cuadrilla turno matutino..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              {/* Servicio o Cliente de Referencia (opcional para salidas) */}
              {movementType === 'exit' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Cliente / Servicio Asignado (Opcional)
                  </label>
                  <input
                    type="text"
                    value={movementServiceId}
                    onChange={(e) => setMovementServiceId(e.target.value)}
                    placeholder="Ej. Torre Reforma Piso 14 o Coworking TechHub"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}

              {/* Responsable */}
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Responsable del Registro
                </label>
                <input
                  type="text"
                  value={movementResponsible}
                  onChange={(e) => setMovementResponsible(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-black/70 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Confirmar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo Insumo */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-black">Nuevo Insumo al Catálogo</h3>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Nombre del Insumo / Producto
                </label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ej. Jabón Líquido Antibacterial para Manos"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Químicos">Químicos</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Consumibles">Consumibles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Código SKU
                  </label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="Ej. QUI-009"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Unidad de Medida
                  </label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="Litros, Unidades..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProdMinStock}
                    onChange={(e) => setNewProdMinStock(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black/70 mb-1">
                  Ubicación en Bodega
                </label>
                <input
                  type="text"
                  value={newProdLocation}
                  onChange={(e) => setNewProdLocation(e.target.value)}
                  placeholder="Ej. Estante A3, Tarima B"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-black/70 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
