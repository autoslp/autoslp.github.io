// Cập nhật công việc
function updateWork(stt) {
  const work = allWorks.find(w => w.stt === stt);
  if (!work) {
    alert('Không tìm thấy công việc để cập nhật.');
    return;
  }

  // Create modal container if not exists
  let modal = document.getElementById('updateWorkModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'updateWorkModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = `
      <div style="background:#fff;padding:20px;border-radius:8px;max-width:600px;width:90%;max-height:90vh;overflow-y:auto;">
        <h4>Cập nhật công việc - STT: ${stt}</h4>
        <form id="updateWorkForm">
          <div class="form-group-row">
            <select id="updateHangMuc" class="form-select">
              <option value="">Hạng mục</option>
              <option value="Sửa chữa">Sửa chữa</option>
              <option value="Bảo dưỡng">Bảo dưỡng</option>
            </select>
            <select id="updatePhanLoai" class="form-select">
              <option value="">Phân loại</option>
              <option value="Điện">Điện</option>
              <option value="Cơ">Cơ</option>
            </select>
            <input type="text" id="updateViTri" class="form-control" placeholder="Vị trí" />
          </div>
          <div>
            <label>Hiện trạng:</label>
            <input type="text" id="updateHienTrang" class="form-control" placeholder="Nhập hiện trạng" />
          </div>
          <div>
            <label>Nguyên nhân:</label>
            <input type="text" id="updateNguyenNhan" class="form-control" placeholder="Mô tả nguyên nhân" />
          </div>
          <div>
            <label>Phương án xử lý:</label>
            <input type="text" id="updatePhuongAnXuLy" class="form-control" placeholder="Mô tả phương án xử lý" />
          </div>
          <div>
            <label>Vật tư thay thế:</label>
            <input type="text" id="updateVatTuThayThe" class="form-control" placeholder="Danh sách vật tư" />
          </div>
          <div class="form-group-row">
            <div>
              <label>Người làm chính:</label>
              <select id="updateNguoiLamChinh" class="form-select">
                <option value="">-- Chọn người thực hiện --</option>
              </select>
            </div>
            <div>
              <label>Người làm phụ 1:</label>
              <select id="updateNguoiLamPhu1" class="form-select">
                <option value="">-- Chọn người thực hiện --</option>
              </select>
            </div>
            <div>
              <label>Người làm phụ 2:</label>
              <select id="updateNguoiLamPhu2" class="form-select">
                <option value="">-- Chọn người thực hiện --</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" id="cancelUpdateBtn" class="btn btn-secondary btn-action">Hủy</button>
            <button type="submit" class="btn btn-primary btn-action">Lưu Cập Nhật</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    // Cancel button handler
    document.getElementById('cancelUpdateBtn').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Form submit handler
    document.getElementById('updateWorkForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const updatedData = {
        hangmuc: document.getElementById('updateHangMuc').value.trim(),
        phanloai: document.getElementById('updatePhanLoai').value.trim(),
        vitri: document.getElementById('updateViTri').value.trim(),
        hientrang: document.getElementById('updateHienTrang').value.trim(),
        nguyennhan: document.getElementById('updateNguyenNhan').value.trim(),
        phuonganxuly: document.getElementById('updatePhuongAnXuLy').value.trim(),
        vattu: document.getElementById('updateVatTuThayThe').value.trim(),
        nguoilamchinh: document.getElementById('updateNguoiLamChinh').value.trim(),
        nguoilamphu1: document.getElementById('updateNguoiLamPhu1').value.trim(),
        nguoilamphu2: document.getElementById('updateNguoiLamPhu2').value.trim(),
      };
      
      // Map to Google Sheet columns based on your image
      const fields = [
        {column: 'J', value: updatedData.hangmuc},   // Hạng mục
        {column: 'K', value: updatedData.phanloai},  // Phân loại
        {column: 'L', value: updatedData.vitri},     // Vị trí
        {column: 'M', value: updatedData.hientrang}, // Hiện trạng
        {column: 'N', value: updatedData.nguyennhan},// Nguyên nhân
        {column: 'O', value: updatedData.phuonganxuly}, // Phương án xử lý
        {column: 'P', value: updatedData.vattu},     // Vật tư thay thế
        {column: 'U', value: updatedData.nguoilamchinh}, // Người làm chính
        {column: 'V', value: updatedData.nguoilamphu1},  // Người làm phụ 1
        {column: 'W', value: updatedData.nguoilamphu2},  // Người làm phụ 2
      ];
      
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwk_WcdzSzKLlQqmCvU53cz8A4lpnG6GAeKpxFrqnUX612rcLTUIMe1rqVIO9FvpxJA/exec', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stt: stt,
            fields: fields
          })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
          alert('Cập nhật thành công!');
          modal.style.display = 'none';
          loadWorkList(); // Refresh the work list
        } else {
          alert('Có lỗi khi cập nhật: ' + result.message);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
        alert('Có lỗi khi kết nối đến server. Vui lòng thử lại!');
      }
    });
    
    // Fetch danh sách người làm từ Sheet Data và đổ vào các select
    fetchNguoiLamList();
  }

  // Pre-fill form fields with current data
  document.getElementById('updateHangMuc').value = work.hangmuc || '';
  document.getElementById('updatePhanLoai').value = work.phanloai || '';
  document.getElementById('updateViTri').value = work.vitri || '';
  document.getElementById('updateHienTrang').value = work.hientrang || '';
  document.getElementById('updateNguyenNhan').value = work.nguyennhan || '';
  document.getElementById('updatePhuongAnXuLy').value = work.phuonganhxuly || '';
  document.getElementById('updateVatTuThayThe').value = work.vattu || '';
  document.getElementById('updateNguoiLamChinh').value = work.thuchienboy1 || '';
  document.getElementById('updateNguoiLamPhu1').value = work.thuchienboy2 || '';
  document.getElementById('updateNguoiLamPhu2').value = work.thuchienboy3 || '';

  modal.style.display = 'flex';
}