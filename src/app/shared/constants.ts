export const SERVER_API_URL = '../../../api';
export const langId  = 'en' ;

export let dtOptions = {
  pagingType: 'full_numbers',
  // scrollY: 300,
  paging: true,
  pageLength: 10,
  lengthChange: false,
  language: {
    decimal:        ',',
    info:           '_START_ à _END_ sur _TOTAL_',
    infoEmpty:      '0 to 0 of 0',
    paginate: {
      first:      '<<',
      last:       '>>',
      next:       '>',
      previous:   '<'
    },
    zeroRecords:    'Aucune valeur retrouvée',
    search:         'Recherche',
    processing:     'En cours d\'exécution...',
    loadingRecords: 'Chargement...',
  },
  buttons: [
    'columnsToggle',
    'colvis',
    'copy',
    'print',
    'excel'
  ]
};
export let dtOptionsAllButtons = {...dtOptions, dom: 'Bfrtip', buttons: [
    'columnsToggle',
    'colvis',
    'copy',
    'print',
    'excel'
  ]};

export let dtOptionsExcelPrintButtons = {...dtOptions, dom: 'Bfrtip', buttons: [
    'copy',
    'print',
    'excel'
  ]};


export let dtOptionsExcelButtons = {...dtOptions, dom: 'Bfrtip', buttons: [
    'copy',
    'excel'
  ]};

