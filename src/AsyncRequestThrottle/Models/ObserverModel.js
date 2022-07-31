/* Model data object used for communication to all observers by fetchWrapper service. */
export function ObserverModel(type, itemName, queueName) {
    this.type = type;
    this.itemName = itemName;
    this.queueName = queueName;
}

