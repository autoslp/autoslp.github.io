// Stage Generator - Tạo các file stage từ template
class StageGenerator {
  constructor() {
    this.templatePath = 'stage-template.html';
    this.configPath = 'stage-config.js';
  }

  // Đọc template file
  async loadTemplate() {
    try {
      const response = await fetch(this.templatePath);
      return await response.text();
    } catch (error) {
      console.error('Lỗi đọc template:', error);
      return null;
    }
  }

  // Thay thế placeholder trong template
  replaceTemplate(template, stageCode, config) {
    const stageName = config.name;
    const stageIcon = config.icon;
    const stageDescription = config.description;
    
    // Tạo active class cho các nav link
    const navActiveMap = {
      xa: '', xen: '', in: '', boi: '', be: '', dan: '', kho: ''
    };
    navActiveMap[stageCode] = 'active';

    // Tạo machine options
    let machineOptions = '';
    if (config.machines) {
      config.machines.forEach(machine => {
        machineOptions += `<option value="${machine}">${machine}</option>\n                `;
      });
    }

    // Tạo table headers
    let tableHeaders = '';
    if (config.tableColumns) {
      config.tableColumns.forEach(column => {
        tableHeaders += `<th style="width: ${column.width || 'auto'}">${column.label}</th>\n                  `;
      });
      tableHeaders += '<th style="width: 150px">Thao tác</th>';
    }

    // Tạo form fields
    let formFields = '';
    if (config.formFields) {
      config.formFields.forEach(field => {
        const colSpan = field.colSpan || 4;
        const required = field.required ? 'required' : '';
        
        formFields += `<div class="col-md-${colSpan}">\n                `;
        formFields += `<label class="form-label">${field.label}:</label>\n                `;
        
        if (field.type === 'select') {
          formFields += `<select class="form-control" id="${field.field}" ${required}>\n                  `;
          formFields += '<option value="">Chọn...</option>\n';
          if (field.options) {
            field.options.forEach(option => {
              formFields += `                  <option value="${option}">${option}</option>\n`;
            });
          }
          formFields += '                </select>\n';
        } else if (field.type === 'textarea') {
          const rows = field.rows || 3;
          formFields += `<textarea class="form-control" id="${field.field}" rows="${rows}" ${required}></textarea>\n`;
        } else {
          formFields += `<input type="${field.type}" class="form-control" id="${field.field}" ${required}>\n`;
        }
        
        formFields += '              </div>\n              ';
      });
    }

    // Tạo quantity fields
    let quantityFields = '';
    if (config.quantityFields) {
      config.quantityFields.forEach(field => {
        const required = field.required ? 'required' : '';
        
        quantityFields += '<div class="mb-3">\n              ';
        quantityFields += `<label class="form-label">${field.label}:</label>\n              `;
        
        if (field.type === 'textarea') {
          const rows = field.rows || 3;
          quantityFields += `<textarea class="form-control" id="${field.field}" rows="${rows}" ${required}></textarea>\n`;
        } else {
          quantityFields += `<input type="${field.type}" class="form-control" id="${field.field}" ${required}>\n`;
        }
        
        quantityFields += '            </div>\n            ';
      });
    }

    // Thay thế các placeholder
    let result = template
      .replace(/\{STAGE_NAME\}/g, stageName)
      .replace(/\{STAGE_CODE\}/g, stageCode)
      .replace(/\{STAGE_ICON\}/g, stageIcon)
      .replace(/\{STAGE_DESCRIPTION\}/g, stageDescription)
      .replace(/\{XA_ACTIVE\}/g, navActiveMap.xa)
      .replace(/\{XEN_ACTIVE\}/g, navActiveMap.xen)
      .replace(/\{IN_ACTIVE\}/g, navActiveMap.in)
      .replace(/\{BOI_ACTIVE\}/g, navActiveMap.boi)
      .replace(/\{BE_ACTIVE\}/g, navActiveMap.be)
      .replace(/\{DAN_ACTIVE\}/g, navActiveMap.dan)
      .replace(/\{KHO_ACTIVE\}/g, navActiveMap.kho)
      .replace(/\{MACHINE_OPTIONS\}/g, machineOptions)
      .replace(/\{TABLE_HEADERS\}/g, tableHeaders)
      .replace(/\{FORM_FIELDS\}/g, formFields)
      .replace(/\{QUANTITY_FIELDS\}/g, quantityFields);

    return result;
  }

  // Tạo file stage từ template
  async generateStageFile(stageCode) {
    const template = await this.loadTemplate();
    if (!template) {
      console.error('Không thể đọc template');
      return null;
    }

    const config = window.STAGE_CONFIG[stageCode];
    if (!config) {
      console.error(`Không tìm thấy cấu hình cho stage: ${stageCode}`);
      return null;
    }

    const content = this.replaceTemplate(template, stageCode, config);
    
    // Tạo file name
    const fileName = `stage-${stageCode}.html`;
    
    // Tạo và download file
    this.downloadFile(fileName, content);
    
    return content;
  }

  // Download file
  downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Tạo tất cả file stage
  async generateAllStages() {
    const stages = Object.keys(window.STAGE_CONFIG);
    
    for (const stageCode of stages) {
      console.log(`Tạo file cho stage: ${stageCode}`);
      await this.generateStageFile(stageCode);
      
      // Delay để tránh quá tải browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('Đã tạo xong tất cả file stage');
  }
}

// Tạo instance và expose globally
window.stageGenerator = new StageGenerator();

// Usage examples:
// await stageGenerator.generateStageFile('xa');     // Tạo file cho stage XẢ
// await stageGenerator.generateStageFile('xen');    // Tạo file cho stage XÉN
// await stageGenerator.generateAllStages();         // Tạo tất cả file stage
