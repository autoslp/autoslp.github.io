<?php
// stage-renderer.php - Server-side renderer cho các stage
class StageRenderer {
    private $config;
    private $baseTemplate;
    
    public function __construct($configFile = 'stage-config.json') {
        $this->loadConfig($configFile);
        $this->loadBaseTemplate();
    }
    
    private function loadConfig($configFile) {
        if (file_exists($configFile)) {
            $this->config = json_decode(file_get_contents($configFile), true);
        } else {
            throw new Exception("Config file not found: $configFile");
        }
    }
    
    private function loadBaseTemplate() {
        $this->baseTemplate = file_get_contents('stage-base-template.html');
    }
    
    public function renderStage($stageCode) {
        if (!isset($this->config['stages'][$stageCode])) {
            throw new Exception("Stage not found: $stageCode");
        }
        
        $stageConfig = $this->config['stages'][$stageCode];
        $html = $this->baseTemplate;
        
        // Replace basic info
        $html = str_replace('{STAGE_CODE}', $stageCode, $html);
        $html = str_replace('{STAGE_NAME}', $stageConfig['name'], $html);
        $html = str_replace('{STAGE_ICON}', $stageConfig['icon'], $html);
        $html = str_replace('{STAGE_DESCRIPTION}', $stageConfig['description'], $html);
        
        // Generate navigation menu
        $html = str_replace('{NAVIGATION_MENU}', $this->generateNavigation($stageCode), $html);
        
        // Generate table headers - CHỈ PHẦN NÀY KHÁC NHAU
        $html = str_replace('{TABLE_HEADERS}', $this->generateTableHeaders($stageConfig), $html);
        
        // Generate machine options
        $html = str_replace('{MACHINE_OPTIONS}', $this->generateMachineOptions($stageConfig), $html);
        
        // Generate form fields
        $html = str_replace('{FORM_FIELDS}', $this->generateFormFields($stageConfig), $html);
        
        return $html;
    }
    
    private function generateNavigation($activeStage) {
        $nav = '';
        foreach ($this->config['navigation'] as $item) {
            $activeClass = ($item['id'] === $activeStage) ? 'active' : '';
            $href = ($item['type'] === 'stage') ? "stage.php?s={$item['id']}" : "{$item['id']}.html";
            
            $nav .= "<a href=\"$href\" class=\"nav-link $activeClass\">\n";
            $nav .= "  <i class=\"bi {$item['icon']}\"></i>\n";
            $nav .= "  <span class=\"nav-text\">{$item['text']}</span>\n";
            $nav .= "</a>\n";
        }
        return $nav;
    }
    
    private function generateTableHeaders($stageConfig) {
        $headers = '';
        foreach ($stageConfig['tableColumns'] as $column) {
            $width = isset($column['width']) ? "style=\"width: {$column['width']}\"" : '';
            $headers .= "<th $width>{$column['label']}</th>\n                  ";
        }
        $headers .= '<th style="width: 150px">Thao tác</th>';
        return $headers;
    }
    
    private function generateMachineOptions($stageConfig) {
        $options = '';
        if (isset($stageConfig['machines'])) {
            foreach ($stageConfig['machines'] as $machine) {
                $options .= "<option value=\"$machine\">$machine</option>\n                ";
            }
        }
        return $options;
    }
    
    private function generateFormFields($stageConfig) {
        $fields = '';
        if (isset($stageConfig['formFields'])) {
            foreach ($stageConfig['formFields'] as $field) {
                $colSpan = isset($field['colSpan']) ? $field['colSpan'] : 4;
                $required = isset($field['required']) && $field['required'] ? 'required' : '';
                
                $fields .= "<div class=\"col-md-$colSpan\">\n";
                $fields .= "  <label class=\"form-label\">{$field['label']}:</label>\n";
                
                if ($field['type'] === 'select' && isset($field['options'])) {
                    $fields .= "  <select class=\"form-control\" id=\"{$field['field']}\" $required>\n";
                    $fields .= "    <option value=\"\">Chọn...</option>\n";
                    foreach ($field['options'] as $option) {
                        $fields .= "    <option value=\"$option\">$option</option>\n";
                    }
                    $fields .= "  </select>\n";
                } elseif ($field['type'] === 'textarea') {
                    $rows = isset($field['rows']) ? $field['rows'] : 3;
                    $fields .= "  <textarea class=\"form-control\" id=\"{$field['field']}\" rows=\"$rows\" $required></textarea>\n";
                } else {
                    $fields .= "  <input type=\"{$field['type']}\" class=\"form-control\" id=\"{$field['field']}\" $required>\n";
                }
                
                $fields .= "</div>\n              ";
            }
        }
        return $fields;
    }
    
    public function renderAllStages() {
        $stages = array_keys($this->config['stages']);
        foreach ($stages as $stageCode) {
            $html = $this->renderStage($stageCode);
            file_put_contents("stage-{$stageCode}.html", $html);
        }
        return count($stages);
    }
}

// stage.php - Router file
if (isset($_GET['s'])) {
    $stageCode = $_GET['s'];
    try {
        $renderer = new StageRenderer();
        echo $renderer->renderStage($stageCode);
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Stage not specified";
}
?>
