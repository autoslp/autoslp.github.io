// API đơn giản cho máy

// 1. Lấy danh sách máy rảnh
app.get('/api/available_machines', (req, res) => {
    const query = `
        SELECT machine_id, machine_name
        FROM production_machines 
        WHERE current_order_id IS NULL
        ORDER BY machine_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Lỗi lấy danh sách máy rảnh:', err);
            return res.status(500).json({ 
                error: 'Lỗi lấy danh sách máy rảnh', 
                details: err.message 
            });
        }

        res.json({
            available_machines: results
        });
    });
});

// 2. Bắt đầu lệnh trên máy
app.post('/api/start_order_on_machine', (req, res) => {
    const { machine_id, order_id, order_code } = req.body;

    if (!machine_id || !order_id || !order_code) {
        return res.status(400).json({ error: 'Thiếu thông tin: machine_id, order_id, order_code' });
    }

    const query = `CALL StartOrderOnMachine(?, ?, ?)`;
    
    db.query(query, [machine_id, order_id, order_code], (err, results) => {
        if (err) {
            console.error('❌ Lỗi bắt đầu lệnh trên máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi bắt đầu lệnh trên máy', 
                details: err.message 
            });
        }

        res.json({
            success: true,
            message: `Đã bắt đầu lệnh ${order_code} trên máy ${machine_id}`,
            machine_id: machine_id,
            order_id: order_id,
            order_code: order_code
        });
    });
});

// 3. Kết thúc lệnh trên máy
app.post('/api/end_order_on_machine', (req, res) => {
    const { machine_id, order_id } = req.body;

    if (!machine_id || !order_id) {
        return res.status(400).json({ error: 'Thiếu thông tin: machine_id, order_id' });
    }

    const query = `CALL EndOrderOnMachine(?, ?)`;
    
    db.query(query, [machine_id, order_id], (err, results) => {
        if (err) {
            console.error('❌ Lỗi kết thúc lệnh trên máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi kết thúc lệnh trên máy', 
                details: err.message 
            });
        }

        res.json({
            success: true,
            message: `Đã kết thúc lệnh trên máy ${machine_id}`,
            machine_id: machine_id,
            order_id: order_id
        });
    });
});

// 4. Lấy trạng thái máy
app.get('/api/machine_status', (req, res) => {
    const query = `SELECT * FROM v_machine_status`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Lỗi lấy trạng thái máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi lấy trạng thái máy', 
                details: err.message 
            });
        }

        res.json({
            machines: results
        });
    });
});

// 5. Kiểm tra máy có rảnh không
app.get('/api/check_machine/:machine_id', (req, res) => {
    const machine_id = req.params.machine_id;

    const query = `SELECT IsMachineAvailable(?) as is_available`;
    
    db.query(query, [machine_id], (err, results) => {
        if (err) {
            console.error('❌ Lỗi kiểm tra máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi kiểm tra máy', 
                details: err.message 
            });
        }

        const isAvailable = results[0].is_available === 1;
        
        res.json({
            machine_id: machine_id,
            is_available: isAvailable
        });
    });
}); 