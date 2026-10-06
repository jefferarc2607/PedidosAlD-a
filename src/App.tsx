import React, { useState, useEffect, useMemo } from 'react';
import { Order, OrderStatus, ViewTab } from './types/order.ts';
import { loadOrdersFromStorage, saveOrdersToStorage } from './utils/storage.ts';
import { getTodayString, getTomorrowString, formatFriendlyDate } from './utils/dateUtils.ts';
import { Header } from './components/Header.tsx';
import { NavigationTabs } from './components/NavigationTabs.tsx';
import { OrderCard } from './components/OrderCard.tsx';
import { OrderFormModal } from './components/OrderFormModal.tsx';
import { ConfirmationMessageModal } from './components/ConfirmationMessageModal.tsx';
import { ProductionSummaryModal } from './components/ProductionSummaryModal.tsx';
import { DailySummaryView } from './components/DailySummaryView.tsx';
import {
  Plus,
  Search,
  Sparkles,
  Inbox,
  CheckCircle2,
  Calendar,
  UtensilsCrossed,
} from 'lucide-react';

export default function App() {
  // Estado principal de la lista de pedidos
  const [orders, setOrders] = useState<Order[]>(() => loadOrdersFromStorage());

  // Navegación entre vistas
  const [currentTab, setCurrentTab] = useState<ViewTab>('dia');

  // Filtro de fecha para la pestaña "Pedidos del Día" ('hoy', 'manana', 'todos')
  const [dayFilter, setDayFilter] = useState<'hoy' | 'manana' | 'todos'>('hoy');

  // Buscador de clientes o productos
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de modales interactivos
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [messageModalOrder, setMessageModalOrder] = useState<Order | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [productionTargetDate, setProductionTargetDate] = useState<string>(getTomorrowString());

  const today = getTodayString();
  const tomorrow = getTomorrowString();

  /**
   * Sincronización en LocalStorage:
   * ¡PUNTO CRÍTICO!
   * Siempre guardar en `useEffect` cuando cambie el estado de orders.
   * Evita guardar estado desactualizado (stale closures) dentro de las funciones handlers.
   */
  useEffect(() => {
    saveOrdersToStorage(orders);
  }, [orders]);

  // Manejador para crear o actualizar un pedido
  const handleSaveOrder = (savedOrder: Order) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === savedOrder.id);
      if (exists) {
        // Actualizar pedido existente (inmutablemente)
        return prev.map((o) => (o.id === savedOrder.id ? savedOrder : o));
      } else {
        // Agregar al inicio para visibilidad inmediata
        return [savedOrder, ...prev];
      }
    });
  };

  /**
   * Manejador de cambio de estado (pendiente -> listo -> entregado).
   * ¡PUNTO CRÍTICO!
   * No mutar el array original con `order.status = newStatus` ni con `splice`.
   * En React siempre usar `map` para retornar una nueva referencia de objeto y array,
   * garantizando que los componentes hijos detecten el cambio.
   */
  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  // Manejador para eliminar un pedido con confirmación nativa sencilla
  const handleDeleteOrder = (id: string) => {
    const toDelete = orders.find((o) => o.id === id);
    const name = toDelete ? `de "${toDelete.customerName}"` : '';
    if (window.confirm(`¿Estás seguro de eliminar el pedido ${name}?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  // Abrir modal de redacción de mensaje de confirmación para un pedido específico
  const handleOpenMessageModal = (order: Order) => {
    setMessageModalOrder(order);
    setIsMessageModalOpen(true);
  };

  // Abrir modal de edición
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsFormModalOpen(true);
  };

  // Abrir formulario nuevo
  const handleOpenNewOrder = () => {
    setEditingOrder(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal de resumen de producción
  const handleOpenProductionModal = (targetDate?: string) => {
    setProductionTargetDate(targetDate || tomorrow);
    setIsProductionModalOpen(true);
  };

  /**
   * Filtrado y clasificación de pedidos para la vista activa:
   */
  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== 'entregado').length;
  }, [orders]);

  const closedOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'entregado').length;
  }, [orders]);

  // Lista de Pedidos del Día (activos: pendientes y listos)
  const filteredActiveOrders = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'entregado')
      .filter((o) => {
        if (dayFilter === 'hoy') return o.deliveryDate === today;
        if (dayFilter === 'manana') return o.deliveryDate === tomorrow;
        return true; // todos
      })
      .filter((o) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          o.customerName.toLowerCase().includes(q) ||
          o.items.toLowerCase().includes(q) ||
          (o.notes && o.notes.toLowerCase().includes(q))
        );
      })
      // ¡PUNTO CRÍTICO! Ordenar cronológicamente por hora de entrega
      .sort((a, b) => {
        if (a.deliveryDate !== b.deliveryDate) {
          return a.deliveryDate.localeCompare(b.deliveryDate);
        }
        return a.deliveryTime.localeCompare(b.deliveryTime);
      });
  }, [orders, dayFilter, today, tomorrow, searchQuery]);

  // Lista de Pedidos Cerrados (entregados)
  const filteredClosedOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === 'entregado')
      .filter((o) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          o.customerName.toLowerCase().includes(q) ||
          o.items.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.deliveryDate.localeCompare(a.deliveryDate) || b.deliveryTime.localeCompare(a.deliveryTime));
  }, [orders, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col pb-20">
      {/* Barra superior fija (Mobile First) */}
      <Header
        onNewOrder={handleOpenNewOrder}
        activeCount={activeOrdersCount}
      />

      {/* Pestañas de navegación de un toque */}
      <NavigationTabs
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        pendingCount={activeOrdersCount}
        closedCount={closedOrdersCount}
      />

      {/* Contenedor central principal */}
      <main className="max-w-3xl w-full mx-auto px-4 py-4 flex-1">
        {/* VISTA 1: PEDIDOS DEL DÍA (Activos: Pendientes y Listos) */}
        {currentTab === 'dia' && (
          <div className="space-y-3.5">
            {/* Barra de Filtros rápidos de fecha y búsqueda */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
              {/* Selector de día: Hoy vs Mañana vs Todos */}
              <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl">
                <button
                  onClick={() => setDayFilter('hoy')}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    dayFilter === 'hoy'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Hoy
                </button>
                <button
                  onClick={() => setDayFilter('manana')}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    dayFilter === 'manana'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Mañana
                </button>
                <button
                  onClick={() => setDayFilter('todos')}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    dayFilter === 'todos'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Todos los días
                </button>
              </div>

              {/* Buscador de pedidos */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar cliente o comida..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Acceso rápido a redactar producción para el día siguiente */}
            <div className="bg-amber-100/70 border border-amber-300/70 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  ¿Planificando la cuadra? Redactá el <strong>resumen de producción para mañana</strong> con 1 tap.
                </span>
              </div>
              <button
                onClick={() => handleOpenProductionModal(tomorrow)}
                className="min-h-[38px] px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                Redactar
              </button>
            </div>

            {/* Listado de tarjetas de pedidos activos */}
            {filteredActiveOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3 mt-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-800">
                  No hay pedidos pendientes para {dayFilter === 'hoy' ? 'hoy' : dayFilter === 'manana' ? 'mañana' : 'esta búsqueda'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Todos los pedidos están entregados o aún no cargaste pedidos para esta fecha.
                </p>
                <button
                  onClick={handleOpenNewOrder}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Capturar Pedido</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActiveOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    onOpenMessageModal={handleOpenMessageModal}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA 2: CERRADOS (Entregados / Historial completado) */}
        {currentTab === 'cerrados' && (
          <div className="space-y-3.5">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Pedidos Cerrados y Entregados</span>
                </h2>
                <p className="text-xs text-stone-500">
                  Historial de pedidos que ya salieron de la cocina y fueron entregados
                </p>
              </div>
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en cerrados..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 bg-stone-50 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {filteredClosedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-2 mt-4">
                <p className="text-stone-500 text-xs">
                  No hay pedidos cerrados registrados todavía.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClosedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    onOpenMessageModal={handleOpenMessageModal}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA 3: RESUMEN DEL DÍA & TOTAL A COBRAR */}
        {currentTab === 'resumen' && (
          <DailySummaryView
            orders={orders}
            onOpenProductionModal={handleOpenProductionModal}
            onSelectTab={setCurrentTab}
          />
        )}
      </main>

      {/* Botón flotante inferior accesible con el pulgar para agregar pedido rápido */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={handleOpenNewOrder}
          className="min-h-[52px] min-w-[52px] px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer border border-amber-300"
          aria-label="Capturar nuevo pedido"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="font-semibold hidden xs:inline">Tomar Pedido</span>
        </button>
      </div>

      {/* Modal 1: Formulario de Captura de Pedido */}
      <OrderFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveOrder}
        initialOrder={editingOrder}
      />

      {/* Modal 2: Redactor de Mensaje de Confirmación al Cliente */}
      <ConfirmationMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setMessageModalOrder(null);
        }}
        order={messageModalOrder}
      />

      {/* Modal 3: Resumen de Producción para el Día Siguiente (o fecha elegida) */}
      <ProductionSummaryModal
        isOpen={isProductionModalOpen}
        onClose={() => setIsProductionModalOpen(false)}
        orders={orders}
        defaultDate={productionTargetDate}
      />
    </div>
  );
}
