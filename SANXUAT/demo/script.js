const stages = [
    "XẢ", "XÉN", "IN OFFSET", "XÉN TOA", "KCS IN", "KCS SAU IN", "KHO NG IN", "LÁNG", "IN LƯỚI", "BỒI", "BẾ", "BÓC LỀ", "DÁN MÁY", "KHO THÀNH PHẨM"
];

let orders = [];

function addOrder() {
    const name = document.getElementById('productName').value.trim();
    const qty = parseInt(document.getElementById('quantity').value);
    if (!name || !qty) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    const order = {
        id: Date.now(),
        name,
        qty,
        stages: Array(stages.length).fill(false)
    };
    orders.push(order);
    renderOrders();
    document.getElementById('productName').value = '';
    document.getElementById('quantity').value = '';
}

function toggleStage(orderId, stageIdx) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.stages[stageIdx] = !order.stages[stageIdx];
        renderOrders();
    }
}

function renderOrders() {
    const list = document.getElementById('orders-list');
    list.innerHTML = '';
    orders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order';
        div.innerHTML = `<div class='order-title'>${order.name} (SL: ${order.qty})</div>`;
        const stagesDiv = document.createElement('div');
        stagesDiv.className = 'stages';
        stages.forEach((stage, idx) => {
            const btn = document.createElement('span');
            btn.className = 'stage' + (order.stages[idx] ? ' done' : '');
            btn.textContent = stage;
            btn.onclick = () => toggleStage(order.id, idx);
            stagesDiv.appendChild(btn);
        });
        div.appendChild(stagesDiv);
        list.appendChild(div);
    });
}
