const en = {
  lang: 'EN',
  wordmark: { sub: 'Restoration · single-cab pickup' },
  sync: { loading: 'loading', saving: 'saving', synced: 'synced', dirty: 'pending', error: 'error', offline: 'local' },
  nav: { repuestos: 'Parts', gastos: 'Expenses', checklist: 'Checklist', necesito: 'Need', fotos: 'Photos' },

  repuestos: {
    title: 'Parts',
    sub: 'Current inventory · tap status to cycle',
    installed: (n, t) => `${n} / ${t} installed`,
    all: 'All', pending: 'Pending', ordered: 'Ordered', installed: 'Installed',
    notePlaceholder: 'Note…',
    empty: 'No parts in this category.',
  },

  gastos: {
    title: 'Expenses',
    totalSpent: 'Total spent',
    date: 'Date', category: 'Category', description: 'Description', amount: 'Price (USD)', note: 'Note',
    add: 'Add',
    allCats: 'All',
    expenses: (n) => `${n} ${n === 1 ? 'expense' : 'expenses'}`,
    empty: 'No expenses recorded.',
    cats: {
      engine: 'Engine', brakes: 'Brakes', steering: 'Steering', suspension: 'Suspension',
      hydraulics: 'Hydraulics', body: 'Body', tools: 'Tools', other: 'Other',
    },
  },

  checklist: {
    title: 'Checklist',
    sub: 'Restoration tasks',
    done: (n, t) => `${n} / ${t} done`,
    newTask: 'New task',
    placeholder: 'E.g.: Replace head gaskets',
    add: 'Add',
    completedSection: (n) => `Completed (${n})`,
    empty: 'No tasks.',
  },

  necesito: {
    title: 'Need to Get',
    sub: 'Parts or materials to source',
    descLabel: 'Description', descPlaceholder: 'E.g.: Head gasket 2.25L',
    refLabel: 'Code / ref', refPlaceholder: 'E.g.: 538403',
    prioLabel: 'Priority',
    prios: { alta: 'High', normal: 'Normal', baja: 'Low' },
    noteLabel: 'Note (optional)', notePlaceholder: 'Where to find, estimated price…',
    add: 'Add',
    need: 'Need', found: 'Found',
    all: 'All', needed: 'Needed',
    empty: 'No items.',
  },

  fotos: {
    title: 'Progress Photos',
    sub: (total, seeded, uploaded) =>
      `${total} ${total === 1 ? 'photo' : 'photos'} · ${seeded} in repo · ${uploaded} uploaded`,
    select: 'Select photo',
    dateLabel: 'Date', titleLabel: 'Title', titlePlaceholder: 'E.g.: Rear axle disassembly',
    tagsLabel: 'Tags (comma-separated)', tagsPlaceholder: 'E.g.: axles, brakes, engine',
    save: 'Save photo',
    all: 'All',
    delete: 'Delete', close: 'Close',
    emptyNone: 'No photos yet.',
    emptyTag: 'No photos with that tag.',
    repo: 'repo',
  },
}

export default en
