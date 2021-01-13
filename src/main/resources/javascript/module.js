function getPayload(type, uuid, jsonUrl) {
  $.ajax({
    url: jsonUrl,
    dataType: 'json',
    success: function (result) {
      if (type == 'Orders') {
        console.info("Building " + type + " table...")
        buildOrders(uuid, result);
      } else if (type == 'Tickets') {
        console.info("Building " + type + " table...")
        buildTickets(uuid, result);
      } else {
        console.error("Error-No table type found");
        return;
      }
    },
    error: function (jqXHR, textStatus, error) {
      console.log("Error-" + textStatus + "-" + error);
    }
  });
}

function buildOrders(uuid, result) {
  var tableID = '#table-' + uuid;
  $(tableID).DataTable({
    data: result.items,
    order: [[5, "desc"]],
    columns: [{data: "WebOrder"}, {data: "Invoice"}, {data: "Customer"}, {data: "Master"}, {data: "PO"}, {data: "Date"}, {data: "Items"}, {data: "POTotal"}, {data: "Status"}],
    columnDefs: [
      {title: "Web Order #", targets: 0, orderable: false}, {title: "Invoice #", targets: 1, orderable: false},
      {title: "Customer", targets: 2, orderable: false}, {title: "Master", targets: 3, orderable: false},
      {title: "PO", targets: 4, orderable: false}, {
        title: "Date",
        targets: 5,
        orderable: false,
        render: function (data, type, row, meta) {
          return formatDate(data)
        }
      },
      {title: "Items", targets: 6, orderable: false}, {title: "POTotal", targets: 7, orderable: false}, {
        title: "Status",
        targets: 8,
        orderable: false
      },
      {
        title: "", targets: 9, orderable: false, className: 'dt-body-right', render: function (data, type, row, meta) {
          return '<input class="cc-button-primary" type="button" value="Details"> &nbsp;<input class="cc-button-primary" type="button" value="Reorder">';
        }
      }
    ],
    //language: {emptyTable: 'No ' + widget.tabName() + ' found'},
    lengthChange: false,
    pageLength: 5,
    destroy: true,
  });
}

function buildTickets(uuid, result) {
  var tableID = '#table-' + uuid;
  $(tableID).DataTable({
    data: result.items,
    order: [[6, "desc"]],
    columns: [
      {data: "CriticalFlag"},
      {data: "SeverityCdMeaning"},
      {data: "SeverityRank"},
      {data: "SrNumber"},
      {data: "Title"},
      {data: "ChannelTypeCdMeaning"},
      {data: "LastUpdateDate"},
      {data: "AccountPartyName"},
      {data: "StatusCdMeaning"}
    ],
    columnDefs: [
      {
        title: " ", targets: 0, orderable: false, render: function (data, type, row, meta) {
          var image = '';
          if (data === true) {
            image = '';//'<img alt="Critical" src="' + ss_images + '/tables/alert.png">';
          }
          return image;
        }
      },
      {title: "Severity", targets: 1, orderable: false},
      {title: "Rank", targets: 2, orderable: false},
      {title: "Number", targets: 3, orderable: false},
      {title: "Title", targets: 4, orderable: false},
      {
        title: "Channel", targets: 5, orderable: false, render: function (data, type, row, meta) {
          return '';//'<img alt="' + data + '" src="' + ss_images + '/tables/' + data.toLowerCase() + '.png">&nbsp;' + data;
        }
      },
      {
        title: "Last Updated", targets: 6, orderable: true, render: function (data, type, row, meta) {
          return formatDate(data)
        }, type: "date"
      },
      {title: "Account", targets: 7, orderable: false},
      {title: "Status", targets: 8, orderable: false},
      {
        title: "", targets: 9, orderable: false, className: 'dt-body-right', render: function (data, type, row, meta) {
          return '<input class="cc-button-primary" type="button" value="Chat">';
        }
      }
    ],
    language: {
      //emptyTable: 'No ' + widget.tabName() + ' found'
    },
    lengthChange: false,
    pageLength: 5,
    destroy: true,
    //scrollX: true,
    //scrollCollapse: true
  });
}

function formatDate(value) {
  if (value === null) return "";
  
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  
  var mydate = new Date(value);
  var yyyy = mydate.getFullYear().toString();
  var mm = addZero((mydate.getMonth() + 1).toString()); // getMonth() is zero-based
  var dd = addZero(mydate.getDate().toString());
  var h = mydate.getHours();
  var ap = "AM";
  if (h > 12) {
    h -= 12;
    ap = "PM";
  } else if (h === 0) {
    h = 12;
  }
  var m = mydate.getMinutes();
  var parts;
  if (m <= 0) {
    parts = mm + '/' + dd + '/' + yyyy;
  } else {
    parts = mm + '/' + dd + '/' + yyyy + ' ' + addZero(h) + ':' + addZero(m) + ' ' + ap;
  }
  var mydatestr = new Date(parts);
  return parts;
}