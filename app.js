// Thao tác tăng giảm số lượng trực quan
document.querySelectorAll('.btn-qty').forEach(button => {
    button.addEventListener('click', (e) => {
        const input = e.target.parentElement.querySelector('.input-qty');
        let currentVal = parseInt(input.value);
        if(e.target.classList.contains('plus')) input.value = currentVal + 1;
        if(e.target.classList.contains('minus') && currentVal > 0) input.value = currentVal - 1;
    });
});

// Xử lý gửi dữ liệu đặt hàng
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ràng buộc Cut-off time (Khóa sau 16:00)
    const currentTime = new Date();
    if (currentTime.getHours() >= 24) {
        alert("Hệ thống đã khóa sau 24:00! Không thể nhận đơn đặt hàng cho ngày mai.");
        return;
    }

    const storeId = document.getElementById('storeId').value;
    if(!storeId) { alert("Vui lòng chọn chi nhánh!"); return; }

    let orderItems = [];
    document.querySelectorAll('.product-card').forEach(card => {
        const sku = card.getAttribute('data-sku');
        const qty = parseInt(card.querySelector('.input-qty').value);
        if(qty > 0) {
            orderItems.push({ sku: sku, qty: qty });
        }
    });

    if(orderItems.length === 0) { alert("Vui lòng chọn ít nhất một sản phẩm!"); return; }

    // API Webhook kết nối trực tiếp đến tầng xử lý tự động (Make.com)
    const makeWebhookUrl = 'https://hook.us2.make.com/o6o2xtph13dfii1npecmtc17j1ylko8t';
    
    const payload = {
        storeId: storeId,
        items: orderItems,
        timestamp: currentTime.toISOString()
    };

    fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if(response.ok) {
            alert("Đơn hàng đã được ghi nhận thành công và chuyển về tổng kho kỹ thuật số!");
            document.getElementById('orderForm').reset();
            document.querySelectorAll('.input-qty').forEach(input => input.value = 0);
        } else {
            alert("Hệ thống trục trặc, vui lòng liên hệ IT!");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Lỗi kết nối mạng!");
    });
});
