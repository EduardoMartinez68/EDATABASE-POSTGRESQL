let tableCounter = 0;
let currentTableId = null;

function addTable() {
  const canvas = document.getElementById('canvas');
  const table = document.createElement('div');
  table.classList.add('table');
  table.style.top = '50px';
  table.style.left = '50px';
  table.setAttribute('draggable', 'true');
  table.ondragstart = dragStart;
  table.ondragend = dragEnd;
  table.onclick = () => showTableDetails(table.id);
  table.id = `table-${tableCounter}`;

  const tableHeader = document.createElement('h3');
  tableHeader.innerText = `Table ${tableCounter + 1}`;
  table.appendChild(tableHeader);

  canvas.appendChild(table);
  tableCounter++;
}

function showTableDetails(tableId) {
    currentTableId = tableId;
    const tableDetails = document.getElementById('table-details');
    tableDetails.innerHTML = ''; // Clear previous details
  
    const table = document.getElementById(tableId);

    // Botón para actualizar el nombre de la tabla y las columnas
    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update Table';
    updateButton.classList.add('update-table-button');
    updateButton.onclick = () => updateTable();
    tableDetails.appendChild(updateButton);

    // Nombre de la tabla con un campo de entrada
    const tableNameContainer = document.createElement('div');
    
    const tableNameInput = document.createElement('input');
    tableNameInput.type = 'text';
    tableNameInput.value = table.querySelector('h3').innerText;
    tableNameInput.id = 'table-name-input';
    tableNameInput.classList.add('table-name-input');
    
    const tableNameLabel = document.createElement('label');
    tableNameLabel.innerText = 'Table Name: ';
    tableNameLabel.htmlFor = tableNameInput.id;
    
    tableNameContainer.appendChild(tableNameLabel);
    tableNameContainer.appendChild(tableNameInput);
    tableDetails.appendChild(tableNameContainer);
  
    const columnsTitle = document.createElement('h4');
    columnsTitle.innerText = 'Columns';
    tableDetails.appendChild(columnsTitle);
  
    const columnList = document.createElement('ul');
    columnList.id = 'column-list';
  
    const addColumnButton = document.createElement('button');
    addColumnButton.innerText = 'Add Column';
    addColumnButton.classList.add('add-column-button');
    addColumnButton.onclick = () => addColumn(tableId);
    tableDetails.appendChild(addColumnButton);
  
    tableDetails.appendChild(columnList);
  }




  function updateTableName(tableId) {
    const tableNameInput = document.getElementById('table-name-input');
    const table = document.getElementById(tableId);
    if (tableNameInput && table) {
      const newName = tableNameInput.value.trim();
      if (newName) {
        table.querySelector('h3').innerText = newName;
      }
    }
  }
  
function addColumn(tableId) {
  const columnList = document.getElementById('column-list');
  const columnCount = columnList.children.length;
  const newColumn = document.createElement('li');

  const columnNameInput = document.createElement('input');
  columnNameInput.type = 'text';
  columnNameInput.placeholder = 'Column Name';
  columnNameInput.value = `column_${columnCount + 1}`;

  const columnTypeSelect = document.createElement('select');
  const types = ['INTEGER', 'VARCHAR', 'TEXT', 'DATE', 'BOOLEAN', 'SERIAL'];
  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.innerText = type;
    columnTypeSelect.appendChild(option);
  });

  const notNullCheckbox = document.createElement('input');
  notNullCheckbox.type = 'checkbox';
  notNullCheckbox.id = `not-null-${tableId}-${columnCount}`;
  const notNullLabel = document.createElement('label');
  notNullLabel.innerText = 'Not Null';
  notNullLabel.htmlFor = notNullCheckbox.id;

  const relationButton = document.createElement('button');
  relationButton.innerText = 'Relation';
  relationButton.onclick = (event) => showRelationOptions(event, tableId, newColumn);

  newColumn.appendChild(columnNameInput);
  newColumn.appendChild(columnTypeSelect);
  newColumn.appendChild(notNullCheckbox);
  newColumn.appendChild(notNullLabel);
  newColumn.appendChild(relationButton);
  columnList.appendChild(newColumn);
}


function showRelationOptions(event, tableId, columnElement) {
  const existingOptions = document.querySelector('.relation-options');
  if (existingOptions) existingOptions.remove();

  const relationOptions = document.createElement('div');
  relationOptions.classList.add('relation-options');

  const primaryKeyButton = document.createElement('button');
  primaryKeyButton.innerText = 'Primary Key';
  primaryKeyButton.onclick = () => setPrimaryKey(tableId, columnElement, relationOptions);

  const foreignKeyButton = document.createElement('button');
  foreignKeyButton.innerText = 'Foreign Key';
  foreignKeyButton.onclick = () => setForeignKey(tableId, columnElement, relationOptions);

  relationOptions.appendChild(primaryKeyButton);
  relationOptions.appendChild(foreignKeyButton);

  document.body.appendChild(relationOptions);
  const rect = event.target.getBoundingClientRect();
  relationOptions.style.top = `${rect.bottom + window.scrollY}px`;
  relationOptions.style.left = `${rect.left + window.scrollX}px`;
}

function setPrimaryKey(tableId, columnElement, relationOptions) {
  columnElement.classList.add('primary-key');
  relationOptions.remove();
}

function setForeignKey(tableId, columnElement, relationOptions) {
  relationOptions.remove();

  const tables = document.querySelectorAll('.table');
  const foreignKeyOptions = document.createElement('div');
  foreignKeyOptions.classList.add('relation-options');

  const selectTable = document.createElement('select');
  selectTable.id = 'foreign-table-select';

  tables.forEach(table => {
    if (table.id !== tableId) {
      const option = document.createElement('option');
      option.value = table.id;
      option.innerText = table.querySelector('h3').innerText;
      selectTable.appendChild(option);
    }
  });

  const foreignKeyButton = document.createElement('button');
  foreignKeyButton.innerText = 'Set Foreign Key';
  foreignKeyButton.onclick = () => createForeignKeyRelation(tableId, columnElement, selectTable.value, foreignKeyOptions);

  foreignKeyOptions.appendChild(selectTable);
  foreignKeyOptions.appendChild(foreignKeyButton);

  document.body.appendChild(foreignKeyOptions);
  const rect = columnElement.getBoundingClientRect();
  foreignKeyOptions.style.top = `${rect.bottom + window.scrollY}px`;
  foreignKeyOptions.style.left = `${rect.left + window.scrollX}px`;
}

function createForeignKeyRelation(tableId, columnElement, targetTableId, foreignKeyOptions) {
  columnElement.classList.add('foreign-key');
  columnElement.dataset.foreignKeyTable = targetTableId;
  foreignKeyOptions.remove();
}

function updateTable() {
    if (!currentTableId) return;
  
    const table = document.getElementById(currentTableId);
    const columnList = document.getElementById('column-list');
  
    // Actualiza el nombre de la tabla
    const tableNameInput = document.getElementById('table-name-input');
    if (tableNameInput) {
      table.querySelector('h3').innerText = tableNameInput.value.trim();
    }
  
    // Limpia las columnas existentes en la tabla
    const tableContent = table.querySelectorAll('.column');
    tableContent.forEach(column => column.remove());
  
    // Añade las columnas actualizadas a la tabla
    columnList.querySelectorAll('li').forEach(columnItem => {
      const column = document.createElement('div');
      column.classList.add('column');
  
      const columnName = columnItem.querySelector('input').value;
      const columnType = columnItem.querySelector('select').value;
      const notNull = columnItem.querySelector('input[type="checkbox"]').checked;
  
      column.innerHTML = `<br><strong>${columnName}</strong> ${columnType} ${notNull ? 'NOT NULL' : 'NULL'}`;
      table.appendChild(column);
    });
  }

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  canvas.ondrop = drop;
  canvas.ondragover = allowDrop;
});

function allowDrop(event) {
  event.preventDefault();
}

function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
}

function dragEnd(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const id = event.dataTransfer.getData('text/plain');
  const table = document.getElementById(id);
  const rect = event.target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  table.style.left = `${event.clientX - offsetX}px`;
  table.style.top = `${event.clientY - offsetY}px`;
}




/////////////////////////////////////////////////
function parseSQL(sqlText) {
    const columns = [];
    
    // Remove the "CREATE TABLE" part and the parentheses
    const columnText = sqlText
      .replace(/CREATE TABLE ".*"\./, '')
      .replace(/\)\s*$/, '')
      .trim();
    
    // Split the columns by commas
    const columnLines = columnText.split(/,\s*(?![^()]*\))/);
  
    columnLines.forEach(line => {
      // Extract column name and type
      const [name, typeAndConstraints] = line.split(/\s+(?=[a-zA-Z])/);
      if (name && typeAndConstraints) {
        const typeMatch = typeAndConstraints.match(/^(\w+)(\s+\w+)?/);
        const type = typeMatch ? typeMatch[1] : '';
        const notNull = /NOT NULL/.test(typeAndConstraints);
        
        columns.push({
          name,
          type,
          notNull
        });
      }
    });
    
    return columns;
}


function updateTableFromSQL(tableId, sqlText) {
    const columns = parseSQL(sqlText);
    const table = document.getElementById(tableId);
    const columnList = document.getElementById('column-list');
  
    // Clear existing columns in the table
    const tableContent = table.querySelectorAll('.column');
    tableContent.forEach(column => column.remove());
  
    // Add columns from SQL text
    columns.forEach(column => {
      const columnItem = document.createElement('li');
  
      const columnNameInput = document.createElement('input');
      columnNameInput.type = 'text';
      columnNameInput.placeholder = 'Column Name';
      columnNameInput.value = column.name;
  
      const columnTypeSelect = document.createElement('select');
      const types = ['INTEGER', 'VARCHAR', 'TEXT', 'DATE', 'BOOLEAN', 'SERIAL'];
      types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.innerText = type;
        if (type === column.type) option.selected = true;
        columnTypeSelect.appendChild(option);
      });
  
      const notNullCheckbox = document.createElement('input');
      notNullCheckbox.type = 'checkbox';
      notNullCheckbox.checked = column.notNull;
      const notNullLabel = document.createElement('label');
      notNullLabel.innerText = 'Not Null';
      notNullLabel.htmlFor = notNullCheckbox.id;
  
      const relationButton = document.createElement('button');
      relationButton.innerText = 'Relation';
      relationButton.onclick = (event) => showRelationOptions(event, tableId, columnItem);
  
      columnItem.appendChild(columnNameInput);
      columnItem.appendChild(columnTypeSelect);
      columnItem.appendChild(notNullCheckbox);
      columnItem.appendChild(notNullLabel);
      columnItem.appendChild(relationButton);
      columnList.appendChild(columnItem);
    });
  }


  const sqlText = `
  CREATE TABLE "Fud".users(
    id bigserial,
    photo text,
    user_name varchar(200) NOT NULL,
    email varchar(100) NOT NULL,
    password text NOT NULL,
    first_name varchar(30) NOT NULL,
    second_name varchar(30),
    last_name varchar(90) NOT NULL,
    rol_user smallint,
    language varchar(5),
    id_packs_fud int2
  );
`;

// Actualiza la tabla con ID 'myTable' usando el texto SQL
addColumn('myTable')
updateTableFromSQL('myTable', sqlText);