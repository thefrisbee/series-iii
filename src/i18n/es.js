const es = {
  lang: 'ES',
  wordmark: { sub: 'Restauración · pickup · cabina simple' },
  sync: { loading: 'cargando', saving: 'guardando', synced: 'sincronizado', dirty: 'por guardar', error: 'error', offline: 'local' },
  nav: { repuestos: 'Repuestos', gastos: 'Gastos', checklist: 'Checklist', necesito: 'Necesito', fotos: 'Fotos' },

  repuestos: {
    title: 'Repuestos',
    sub: 'Inventario actual · tocá el estado para avanzar',
    progress: (n, t) => `${n} / ${t} instalados`,
    all: 'Todos', pending: 'Pendiente', ordered: 'Ordenado', installed: 'Instalado',
    notePlaceholder: 'Nota…',
    empty: 'No hay repuestos en esta categoría.',
  },

  gastos: {
    title: 'Gastos',
    totalSpent: 'Total gastado',
    date: 'Fecha', category: 'Categoría', description: 'Concepto', amount: 'Precio (USD)', note: 'Nota',
    add: 'Agregar',
    allCats: 'Todas',
    expenses: (n) => `${n} ${n === 1 ? 'gasto' : 'gastos'}`,
    empty: 'No hay gastos registrados.',
    cats: {
      engine: 'Motor', brakes: 'Frenos', steering: 'Dirección', suspension: 'Suspensión',
      hydraulics: 'Hidráulica', body: 'Carrocería', tools: 'Herramientas', other: 'Otros',
    },
  },

  checklist: {
    title: 'Checklist',
    sub: 'Tareas de la restauración',
    done: (n, t) => `${n} / ${t} hechas`,
    newTask: 'Nueva tarea',
    placeholder: 'Ej: Cambiar juntas de culata',
    add: 'Agregar',
    completedSection: (n) => `Completadas (${n})`,
    empty: 'No hay tareas.',
  },

  necesito: {
    title: 'Necesito conseguir',
    sub: 'Partes o materiales por buscar',
    descLabel: 'Descripción', descPlaceholder: 'Ej: Junta de culata 2.25L',
    refLabel: 'Código / referencia', refPlaceholder: 'Ej: 538403',
    prioLabel: 'Prioridad',
    prios: { alta: 'Alta', normal: 'Normal', baja: 'Baja' },
    noteLabel: 'Nota (opcional)', notePlaceholder: 'Dónde buscar, precio estimado, etc.',
    add: 'Agregar',
    need: 'Necesito', found: 'Conseguido',
    all: 'Todos', needed: 'Necesito',
    empty: 'No hay items.',
  },

  fotos: {
    title: 'Fotos del avance',
    sub: (total, seeded, uploaded) =>
      `${total} ${total === 1 ? 'foto' : 'fotos'} · ${seeded} en repo · ${uploaded} subidas`,
    select: 'Seleccionar foto',
    dateLabel: 'Fecha', titleLabel: 'Título', titlePlaceholder: 'Ej: Desmontaje de eje trasero',
    tagsLabel: 'Tags (separados por coma)', tagsPlaceholder: 'Ej: ejes, frenos, motor',
    save: 'Guardar foto',
    all: 'Todas',
    delete: 'Eliminar', close: 'Cerrar',
    emptyNone: 'Todavía no hay fotos.',
    emptyTag: 'No hay fotos con ese tag.',
    repo: 'repo',
  },
}

export default es
