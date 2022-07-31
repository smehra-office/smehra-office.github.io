import { Counter } from "./Utilities/Counter.js";
import { CreateFetchWrapper } from "./Utilities/FetchWrapper.js";

const createWorkerForm = document.getElementById("createWorkerForm");
const handleWorkerForm = document.getElementById("handleWorkerForm");
const workerDisplayField = document.getElementById("currentNoOfWorkers");
const slider = document.getElementById("noOfWorkers");
const warningMessage = document.getElementById('error-set-worker-limit');

let fetchWrapperObject = null;

const counter = new Counter(1);

function updateMaxWorkers(event) {
    const value = event.target.value;
    workerDisplayField.innerText = value;
};

function setWorkers() {
    const noOfWorkers = Number(workerDisplayField.innerText.toString());

    warningMessage.style.visibility = noOfWorkers ? 'hidden' : 'visible';

    if (noOfWorkers) {
        /* Disabling slider */
        setStatusOfForm(createWorkerForm, true);

        /* We initialise fetchWrapper object */
        fetchWrapperObject = new CreateFetchWrapper(noOfWorkers, [asyncRequestObserver]);

        /* We bind fetchWrapper() on window object so that it is accessible from other parts of the application. 
        If needed, we can instead store this in a local variable and create different instances, instead.
        */
        window.fetchWrapper = fetchWrapperObject.fetchWrapper;
        /* Enabling button controls */
        setStatusOfForm(handleWorkerForm, false);
    }
}

function setStatusOfForm(formElement, shouldDisable) {
    formElement.disabled = shouldDisable;
}

function asyncRequestObserver(dataModel) {
    switch (dataModel.type) {
        case 'PUSH': {
            insertRowInTable(dataModel);
            break;
        }
        case 'POP': {
            deleteRowInTable(dataModel);
            break;
        }
    }
}

function insertRowInTable({ itemName, queueName }) {
    const table = document.getElementById(queueName.toString().toLowerCase());
    const row = table.insertRow(table.rows.length);

    row.id = getIdForRow(itemName, queueName);
    row.insertCell(0).innerText = itemName.toString();
}

function deleteRowInTable({ itemName, queueName }) {
    const row = document.getElementById(getIdForRow(itemName, queueName));
    row.parentNode.removeChild(row);
}

function getIdForRow(item, queue) {
    return `${queue.toString().toLowerCase()}: ${item.toString().toLowerCase()}`;
}

function createAsyncRequest() {
    if (window.fetchWrapper)
        fetchWrapper(`AsyncRequest: ${counter.increment()}`);
}

function bindEventListeners() {
    slider.addEventListener('input', updateMaxWorkers);

    document.getElementById('workerSubmitBtn').addEventListener('click', setWorkers);
    document.getElementById('createRequest').addEventListener('click', createAsyncRequest);
    document.getElementById('reset').addEventListener('click', reset);
};

function reset() {
    if (window.fetchWrapper)
        window.fetchWrapper = null;

    if (fetchWrapperObject)
        fetchWrapperObject.unsubscribeAll();

    if (workerDisplayField)
        workerDisplayField.innerText = 'NA';

    if (warningMessage)
        warningMessage.style.visibility = 'hidden';

    if (slider)
        slider.value = 0;

    setStatusOfForm(createWorkerForm, false);
    setStatusOfForm(handleWorkerForm, true);
    clearRowsOfAllTables();
}

function clearRowsOfAllTables() {
    const tables = ['pending', 'progress', 'completed'];

    tables.forEach(tableId => {
        clearTableRows(tableId);
    });
}

function clearTableRows(tableId) {
    const table = document.getElementById(tableId);

    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

window.addEventListener('load', () => {
    reset();
    bindEventListeners();
});





