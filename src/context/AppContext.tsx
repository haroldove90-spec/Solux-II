import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, StockMovement, Task, SurveyRating, SurveyConfig, Role, MovementType, TaskStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_MOVEMENTS, INITIAL_TASKS, INITIAL_RATINGS, INITIAL_CONFIG } from '../data/initialData';

interface AppContextType {
  currentRole: Role | null;
  setCurrentRole: (role: Role | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  products: Product[];
  movements: StockMovement[];
  tasks: Task[];
  ratings: SurveyRating[];
  surveyConfig: SurveyConfig;
  criticalStockCount: number;
  averageRating: number;
  pendingTasksCount: number;
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
  updateProductStock: (id: string, newStock: number) => void;
  addStockMovement: (data: {
    productId: string;
    type: MovementType;
    quantity: number;
    reason: string;
    responsible: string;
    serviceId?: string;
  }) => void;
  consumeSupplies: (
    items: { productId: string; quantity: number }[],
    serviceId: string,
    responsible: string
  ) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, closingNote?: string) => void;
  submitSurvey: (survey: Omit<SurveyRating, 'id' | 'date'>) => void;
  updateSurveyConfig: (config: Partial<SurveyConfig>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check URL parameters for direct client survey access or role
  const getInitialRole = (): Role | null => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role');
      if (urlRole === 'client' || urlRole === 'admin' || urlRole === 'operative' || urlRole === 'supervisor') {
        return urlRole as Role;
      }
      const savedRole = localStorage.getItem('ecolux_current_role');
      if (savedRole) return savedRole as Role;
    }
    return null; // Show Role Selector on Start
  };

  const [currentRole, setCurrentRoleState] = useState<Role | null>(getInitialRole);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ecolux_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    try {
      const saved = localStorage.getItem('ecolux_movements');
      return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
    } catch {
      return INITIAL_MOVEMENTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('ecolux_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [ratings, setRatings] = useState<SurveyRating[]>(() => {
    try {
      const saved = localStorage.getItem('ecolux_ratings');
      return saved ? JSON.parse(saved) : INITIAL_RATINGS;
    } catch {
      return INITIAL_RATINGS;
    }
  });

  const [surveyConfig, setSurveyConfig] = useState<SurveyConfig>(() => {
    try {
      const saved = localStorage.getItem('ecolux_survey_config');
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ecolux_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ecolux_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('ecolux_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ecolux_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('ecolux_survey_config', JSON.stringify(surveyConfig));
  }, [surveyConfig]);

  const setCurrentRole = (role: Role | null) => {
    setCurrentRoleState(role);
    if (role) {
      localStorage.setItem('ecolux_current_role', role);
      if (role === 'admin') setActiveTab('dashboard');
      else if (role === 'operative' || role === 'supervisor') setActiveTab('my_tasks');
      else if (role === 'client') setActiveTab('client_survey');
    } else {
      localStorage.removeItem('ecolux_current_role');
    }
  };

  // Metrics
  const criticalStockCount = products.filter((p) => p.currentStock <= p.minStock).length;

  const averageRating = ratings.length > 0
    ? Number((ratings.reduce((acc, r) => acc + r.overallScore, 0) / ratings.length).toFixed(1))
    : 5.0;

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  // Inventory actions
  const addProduct = (prodData: Omit<Product, 'id' | 'lastUpdated'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      lastUpdated: today,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProductStock = (id: string, newStock: number) => {
    const today = new Date().toISOString().split('T')[0];
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, currentStock: Math.max(0, newStock), lastUpdated: today } : p))
    );
  };

  const addStockMovement = ({
    productId,
    type,
    quantity,
    reason,
    responsible,
    serviceId,
  }: {
    productId: string;
    type: MovementType;
    quantity: number;
    reason: string;
    responsible: string;
    serviceId?: string;
  }) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId,
      productName: targetProduct.name,
      type,
      quantity,
      reason,
      responsible,
      date: formattedDate,
      serviceId,
    };

    setMovements((prev) => [newMovement, ...prev]);

    // Update inventory quantity
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const delta = type === 'entry' ? quantity : -quantity;
          const updated = Math.max(0, p.currentStock + delta);
          return { ...p, currentStock: updated, lastUpdated: formattedDate.split(' ')[0] };
        }
        return p;
      })
    );
  };

  const consumeSupplies = (
    items: { productId: string; quantity: number }[],
    serviceId: string,
    responsible: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newMovements: StockMovement[] = [];
    const stockDeltas: Record<string, number> = {};

    items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && item.quantity > 0) {
        newMovements.push({
          id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: item.productId,
          productName: prod.name,
          type: 'exit',
          quantity: item.quantity,
          reason: `Consumo en servicio: ${serviceId}`,
          responsible,
          date: formattedDate,
          serviceId,
        });
        stockDeltas[item.productId] = (stockDeltas[item.productId] || 0) + item.quantity;
      }
    });

    if (newMovements.length > 0) {
      setMovements((prev) => [...newMovements, ...prev]);
      setProducts((prev) =>
        prev.map((p) => {
          if (stockDeltas[p.id]) {
            return {
              ...p,
              currentStock: Math.max(0, p.currentStock - stockDeltas[p.id]),
              lastUpdated: formattedDate.split(' ')[0],
            };
          }
          return p;
        })
      );
    }
  };

  // Task actions
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus, closingNote?: string) => {
    const now = new Date();
    const formattedTime = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            closingNote: closingNote !== undefined ? closingNote : t.closingNote,
            completedAt: status === 'completed' ? formattedTime : t.completedAt,
          };
        }
        return t;
      })
    );
  };

  // Survey actions
  const submitSurvey = (surveyData: Omit<SurveyRating, 'id' | 'date'>) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const newRating: SurveyRating = {
      ...surveyData,
      id: `rate-${Date.now()}`,
      date: formattedDate,
    };
    setRatings((prev) => [newRating, ...prev]);
  };

  const updateSurveyConfig = (partial: Partial<SurveyConfig>) => {
    setSurveyConfig((prev) => ({ ...prev, ...partial }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setMovements(INITIAL_MOVEMENTS);
    setTasks(INITIAL_TASKS);
    setRatings(INITIAL_RATINGS);
    setSurveyConfig(INITIAL_CONFIG);
    setCurrentRole(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        products,
        movements,
        tasks,
        ratings,
        surveyConfig,
        criticalStockCount,
        averageRating,
        pendingTasksCount,
        addProduct,
        updateProductStock,
        addStockMovement,
        consumeSupplies,
        addTask,
        updateTaskStatus,
        submitSurvey,
        updateSurveyConfig,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
