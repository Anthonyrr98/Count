// 初始化计数器数据
let counters = JSON.parse(localStorage.getItem('counters') || '[]');
let selectedCounterId = null;

// DOM元素
console.log('初始化DOM元素...');
let countersList, counterDetails, newCounterNameInput, addCounterBtn;
let showChartBtn, chartContainer, chartBars, exportDataBtn, importDataBtn, exportChartBtn, saveStateBtn;
let savedStatesSelect, loadStateBtn, deleteStateBtn, newListBtn, renameStateBtn;

try {
  countersList = document.getElementById('counters-list');
  counterDetails = document.getElementById('counter-details');
  newCounterNameInput = document.getElementById('new-counter-name');
  addCounterBtn = document.getElementById('add-counter-btn');
  showChartBtn = document.getElementById('show-chart-btn');
  chartContainer = document.getElementById('chart-container');
  chartBars = document.getElementById('chart-bars');
  exportDataBtn = document.getElementById('export-data-btn');
  importDataBtn = document.getElementById('import-data-btn');
  exportChartBtn = document.getElementById('export-chart-btn');
  saveStateBtn = document.getElementById('save-state-btn');
  savedStatesSelect = document.getElementById('saved-states-select');
  loadStateBtn = document.getElementById('load-state-btn');
  deleteStateBtn = document.getElementById('delete-state-btn');
  newListBtn = document.getElementById('new-list-btn');
  renameStateBtn = document.getElementById('rename-state-btn');

  // 检查必要元素是否存在
  if (!countersList) console.error('未找到元素: counters-list');
  if (!counterDetails) console.error('未找到元素: counter-details');
  if (!newCounterNameInput) console.error('未找到元素: new-counter-name');
  if (!addCounterBtn) console.error('未找到元素: add-counter-btn');
  if (!saveStateBtn) console.error('未找到元素: save-state-btn');
  if (!savedStatesSelect) console.error('未找到元素: saved-states-select');
  if (!loadStateBtn) console.error('未找到元素: load-state-btn');
  if (!deleteStateBtn) console.error('未找到元素: delete-state-btn');
  if (!newListBtn) console.error('未找到元素: new-list-btn');
  if (!renameStateBtn) console.error('未找到元素: rename-state-btn');
  
  console.log('DOM元素初始化完成', {
    savedStatesSelect,
  });
} catch (error) {
  console.error('DOM元素初始化错误:', error);
}

// 创建隐藏的文件导入输入框
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// 渲染计数器列表
function renderCountersList() {
  countersList.innerHTML = '';
  
  counters.forEach(counter => {
    const counterItem = document.createElement('div');
    counterItem.className = `counter-item ${counter.id === selectedCounterId ? 'selected' : ''}`;
    counterItem.dataset.id = counter.id;
    
    const counterTitle = document.createElement('h3');
    counterTitle.textContent = counter.name;
    
    const counterControls = document.createElement('div');
    counterControls.className = 'counter-controls';
    
    const decrementBtn = document.createElement('button');
    decrementBtn.className = 'decrement';
    decrementBtn.textContent = '-';
    decrementBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCounter(counter.id, -1);
    });
    
    // 使用输入框替代静态文本，允许直接编辑数值
    const counterValue = document.createElement('input');
    counterValue.className = 'counter-value';
    counterValue.type = 'number';
    counterValue.min = '0';
    counterValue.value = counter.value;
    counterValue.style.width = '50px';
    counterValue.style.textAlign = 'center';
    // 当输入框失去焦点或按下回车键时更新值
    counterValue.addEventListener('blur', (e) => {
      e.stopPropagation();
      const newValue = parseInt(e.target.value, 10);
      if (!isNaN(newValue) && newValue >= 0) {
        setCounterValue(counter.id, newValue);
      } else {
        e.target.value = counter.value; // 恢复原始值
      }
    });
    counterValue.addEventListener('keypress', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue) && newValue >= 0) {
          setCounterValue(counter.id, newValue);
        } else {
          e.target.value = counter.value; // 恢复原始值
        }
        e.target.blur();
      }
    });
    // 防止点击输入框时触发计数器选择
    counterValue.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    const incrementBtn = document.createElement('button');
    incrementBtn.textContent = '+';
    incrementBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCounter(counter.id, 1);
    });
    
    counterControls.appendChild(decrementBtn);
    counterControls.appendChild(counterValue);
    counterControls.appendChild(incrementBtn);
    
    counterItem.appendChild(counterTitle);
    counterItem.appendChild(counterControls);
    
    // 添加选择计数器事件
    counterItem.addEventListener('click', () => {
      selectCounter(counter.id);
    });
    
    countersList.appendChild(counterItem);
  });
  
  // 如果图表已显示，则更新图表
  if (chartContainer.style.display === 'block') {
    updateChart();
  }
}

// 直接设置计数器值
function setCounterValue(id, newValue) {
  const counterIndex = counters.findIndex(c => c.id === id);
  if (counterIndex !== -1) {
    counters[counterIndex].value = newValue;
    saveCounters();
    renderCountersList();
    
    if (selectedCounterId === id) {
      renderCounterDetails(counters[counterIndex]);
    }
  }
}

// 更新计数器值
function updateCounter(id, change) {
  const counterIndex = counters.findIndex(c => c.id === id);
  if (counterIndex !== -1) {
    counters[counterIndex].value += change;
    if (counters[counterIndex].value < 0) {
      counters[counterIndex].value = 0;
    }
    saveCounters();
    renderCountersList();
    
    if (selectedCounterId === id) {
      renderCounterDetails(counters[counterIndex]);
    }
  }
}

// 添加新计数器
function addCounter(name) {
  console.log('添加计数器函数被调用，名称:', name);
  
  // 名称为空时返回
  if (!name.trim()) {
    console.log('计数器名称为空，不添加');
    return;
  }
  
  // 创建新计数器对象
  const newCounter = {
    id: Date.now().toString(),
    name: name.trim(),
    value: 0
  };
  
  console.log('新计数器对象:', newCounter);
  
  // 添加到数组
  counters.push(newCounter);
  console.log('当前计数器数量:', counters.length);
  
  // 保存到localStorage并更新UI
  saveCounters();
  renderCountersList();
  selectCounter(newCounter.id);
  
  // 清除输入框
  newCounterNameInput.value = '';
}

// 选择计数器
function selectCounter(id) {
  selectedCounterId = id;
  const counter = counters.find(c => c.id === id);
  
  renderCountersList();
  renderCounterDetails(counter);
}

// 渲染计数器详情
function renderCounterDetails(counter) {
  if (!counter) {
    counterDetails.innerHTML = '请从左侧选择或添加一个计数器';
    return;
  }
  
  counterDetails.innerHTML = '';
  
  const detailTitle = document.createElement('h2');
  detailTitle.textContent = counter.name;
  
  const detailValueContainer = document.createElement('div');
  detailValueContainer.style.display = 'flex';
  detailValueContainer.style.alignItems = 'center';
  detailValueContainer.style.justifyContent = 'center';
  detailValueContainer.style.marginTop = '10px';
  
  const detailValueLabel = document.createElement('span');
  detailValueLabel.textContent = '当前值: ';
  detailValueLabel.style.marginRight = '10px';
  
  // 创建输入框允许直接编辑值
  const detailValueInput = document.createElement('input');
  detailValueInput.type = 'number';
  detailValueInput.min = '0';
  detailValueInput.value = counter.value;
  detailValueInput.style.width = '80px';
  detailValueInput.style.fontSize = '20px';
  detailValueInput.style.textAlign = 'center';
  detailValueInput.style.padding = '5px';
  
  detailValueInput.addEventListener('change', () => {
    const newValue = parseInt(detailValueInput.value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      setCounterValue(counter.id, newValue);
    } else {
      detailValueInput.value = counter.value; // 恢复原始值
    }
  });
  
  detailValueContainer.appendChild(detailValueLabel);
  detailValueContainer.appendChild(detailValueInput);
  
  const controlsContainer = document.createElement('div');
  controlsContainer.style.marginTop = '20px';
  
  const decrementBtn = document.createElement('button');
  decrementBtn.className = 'decrement';
  decrementBtn.textContent = '减少';
  decrementBtn.style.marginRight = '10px';
  decrementBtn.style.fontSize = '16px';
  decrementBtn.style.padding = '8px 16px';
  decrementBtn.addEventListener('click', () => {
    updateCounter(counter.id, -1);
  });
  
  const incrementBtn = document.createElement('button');
  incrementBtn.textContent = '增加';
  incrementBtn.style.fontSize = '16px';
  incrementBtn.style.padding = '8px 16px';
  incrementBtn.addEventListener('click', () => {
    updateCounter(counter.id, 1);
  });
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '删除此计数器';
  deleteBtn.style.marginTop = '20px';
  deleteBtn.style.backgroundColor = '#9e9e9e';
  deleteBtn.addEventListener('click', () => {
    deleteCounter(counter.id);
  });
  
  controlsContainer.appendChild(decrementBtn);
  controlsContainer.appendChild(incrementBtn);
  
  counterDetails.appendChild(detailTitle);
  counterDetails.appendChild(detailValueContainer);
  counterDetails.appendChild(controlsContainer);
  counterDetails.appendChild(deleteBtn);
}

// 删除计数器
function deleteCounter(id) {
  counters = counters.filter(c => c.id !== id);
  saveCounters();
  
  if (selectedCounterId === id) {
    selectedCounterId = counters.length > 0 ? counters[0].id : null;
    
    if (selectedCounterId) {
      const counter = counters.find(c => c.id === selectedCounterId);
      renderCounterDetails(counter);
    } else {
      renderCounterDetails(null);
    }
  }
  
  renderCountersList();
  
  // 如果图表已显示，则更新图表
  if (chartContainer.style.display === 'block') {
    updateChart();
  }
}

// 保存计数器数据到存储
function saveCounters() {
  localStorage.setItem('counters', JSON.stringify(counters));
}

// 导出数据到文件
function exportData() {
  // 创建一个包含数据的对象
  const dataToExport = {
    counters: counters,
    exportDate: new Date().toISOString()
  };
  
  // 转换为JSON字符串
  const jsonData = JSON.stringify(dataToExport, null, 2);
  
  // 创建Blob和下载链接
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // 创建一个临时链接用于触发下载
  const a = document.createElement('a');
  a.href = url;
  a.download = `counter-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

// 从文件导入数据
function importData(file) {
  const reader = new FileReader();
  
  reader.onload = function(event) {
    try {
      const importedData = JSON.parse(event.target.result);
      
      // 验证导入的数据
      if (importedData && Array.isArray(importedData.counters)) {
        // 显示确认对话框
        if (confirm('导入将替换所有现有数据，是否继续？')) {
          // 替换当前数据
          counters = importedData.counters;
          saveCounters();
          renderCountersList();
          
          // 重置选中的计数器
          selectedCounterId = null;
          renderCounterDetails(null);
          
          alert('数据已成功导入！');
        }
      } else {
        alert('导入失败：无效的数据格式！');
      }
    } catch (error) {
      alert('导入失败：' + error.message);
    }
  };
  
  reader.onerror = function() {
    alert('读取文件时发生错误！');
  };
  
  reader.readAsText(file);
}

// 更新图表
function updateChart() {
  chartBars.innerHTML = '';
  
  if (counters.length === 0) {
    chartBars.innerHTML = '<div style="text-align: center; padding: 20px;">没有数据可显示</div>';
    return;
  }
  
  // 计算用于图表的值
  const counterValues = counters.map(c => c.value);
  const maxValue = Math.max(...counterValues, 1);
  
  // 创建图表容器
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '100%';
  chartContainer.style.position = 'relative';
  
  // 创建图表标题
  const chartTitle = document.createElement('div');
  chartTitle.textContent = '计数器数值统计图';
  chartTitle.style.fontSize = '18px';
  chartTitle.style.fontWeight = 'bold';
  chartTitle.style.textAlign = 'center';
  chartTitle.style.marginBottom = '20px';
  chartContainer.appendChild(chartTitle);
  
  // 创建柱状图容器
  const barChartContainer = document.createElement('div');
  barChartContainer.style.height = '350px';
  barChartContainer.style.position = 'relative';
  barChartContainer.style.display = 'flex';
  barChartContainer.style.flexDirection = 'column';
  
  // 创建Y轴刻度和网格线
  const axisHeight = 300; // 图表绘图区域高度（单位：像素）
  const axisContainer = document.createElement('div');
  axisContainer.style.height = `${axisHeight}px`;
  axisContainer.style.position = 'relative';
  axisContainer.style.marginLeft = '50px'; // 为Y轴标签留出空间
  axisContainer.style.marginBottom = '30px'; // 为X轴标签留出空间
  axisContainer.style.border = '1px solid #ddd';
  axisContainer.style.borderTop = 'none';
  axisContainer.style.borderRight = 'none';
  
  // 计算合适的刻度间隔（使用5个刻度为例）
  const scaleCount = 5;
  const scaleUnit = Math.ceil(maxValue / scaleCount);
  const yMax = scaleUnit * scaleCount;
  
  // 绘制Y轴刻度
  for (let i = 0; i <= scaleCount; i++) {
    const value = (scaleCount - i) * scaleUnit;
    const percentage = i / scaleCount * 100;
    
    // 创建刻度线
    const scaleLine = document.createElement('div');
    scaleLine.style.position = 'absolute';
    scaleLine.style.width = '100%';
    scaleLine.style.height = '1px';
    scaleLine.style.backgroundColor = i === scaleCount ? '#666' : '#eee'; // X轴线颜色深一些
    scaleLine.style.top = `${percentage}%`;
    scaleLine.style.left = '0';
    
    // 创建刻度标签
    const scaleLabel = document.createElement('div');
    scaleLabel.textContent = value;
    scaleLabel.style.position = 'absolute';
    scaleLabel.style.top = `${percentage}%`;
    scaleLabel.style.right = '100%';
    scaleLabel.style.transform = 'translateY(-50%)';
    scaleLabel.style.marginRight = '5px';
    scaleLabel.style.fontSize = '12px';
    
    axisContainer.appendChild(scaleLine);
    axisContainer.appendChild(scaleLabel);
  }
  
  // 创建柱状图
  const barsContainer = document.createElement('div');
  barsContainer.style.position = 'absolute';
  barsContainer.style.top = '0';
  barsContainer.style.bottom = '0';
  barsContainer.style.left = '0';
  barsContainer.style.right = '0';
  barsContainer.style.display = 'flex';
  barsContainer.style.justifyContent = 'space-around';
  barsContainer.style.alignItems = 'flex-end';
  barsContainer.style.padding = '0 20px';
  
  // 为每个计数器创建柱子
  counters.forEach((counter, index) => {
    // 创建柱子容器
    const barContainer = document.createElement('div');
    barContainer.style.display = 'flex';
    barContainer.style.flexDirection = 'column';
    barContainer.style.alignItems = 'center';
    barContainer.style.flex = '1';
    barContainer.style.position = 'relative';
    barContainer.style.height = '100%';
    
    // 计算柱子高度（以像素为单位）
    // 严格按照数值比例：(当前值 / 坐标最大值) * 坐标轴高度（像素）
    const ratio = counter.value / yMax;
    const barHeightPixels = Math.round(ratio * axisHeight);
    
    // 创建每个柱子的数值标签
    const valueLabel = document.createElement('div');
    valueLabel.textContent = counter.value;
    valueLabel.style.fontWeight = 'bold';
    valueLabel.style.marginBottom = '5px';
    valueLabel.style.position = 'absolute';
    valueLabel.style.bottom = `${barHeightPixels + 10}px`;
    
    // 创建柱子本身
    const bar = document.createElement('div');
    bar.style.width = '40px';
    bar.style.backgroundColor = 'rgba(54, 162, 235, 0.7)';
    bar.style.border = '1px solid rgba(54, 162, 235, 1)';
    bar.style.borderRadius = '3px 3px 0 0';
    bar.style.position = 'absolute';
    bar.style.bottom = '0';
    bar.style.left = '50%';
    bar.style.transform = 'translateX(-50%)';
    
    // 设置柱子高度，确保即使是0值也有最小高度
    if (counter.value === 0) {
      bar.style.height = '1px';
      bar.style.opacity = '0.3';
    } else {
      bar.style.height = `${barHeightPixels}px`;
    }
    
    // 创建X轴标签（计数器名称）
    const nameLabel = document.createElement('div');
    nameLabel.textContent = counter.name;
    nameLabel.style.position = 'absolute';
    nameLabel.style.bottom = '-25px';
    nameLabel.style.left = '0';
    nameLabel.style.right = '0';
    nameLabel.style.textAlign = 'center';
    nameLabel.style.fontSize = '12px';
    nameLabel.style.overflow = 'hidden';
    nameLabel.style.textOverflow = 'ellipsis';
    nameLabel.style.whiteSpace = 'nowrap';
    
    // 组装柱子组件
    barContainer.appendChild(valueLabel);
    barContainer.appendChild(bar);
    barContainer.appendChild(nameLabel);
    barsContainer.appendChild(barContainer);
  });
  
  // 添加Y轴标题
  const yAxisTitle = document.createElement('div');
  yAxisTitle.textContent = '数值';
  yAxisTitle.style.position = 'absolute';
  yAxisTitle.style.transform = 'rotate(-90deg)';
  yAxisTitle.style.transformOrigin = 'left top';
  yAxisTitle.style.left = '15px';
  yAxisTitle.style.top = `${axisHeight / 2}px`;
  yAxisTitle.style.fontSize = '12px';
  
  // 将所有元素组装到图表中
  axisContainer.appendChild(barsContainer);
  barChartContainer.appendChild(axisContainer);
  barChartContainer.appendChild(yAxisTitle);
  chartContainer.appendChild(barChartContainer);
  
  // 添加图例
  const legend = document.createElement('div');
  legend.style.marginTop = '20px';
  legend.style.textAlign = 'center';
  legend.style.fontSize = '12px';
  legend.innerHTML = '注: 柱高严格按照数值比例显示，每个刻度单位为' + scaleUnit;
  chartContainer.appendChild(legend);
  
  // 将整个图表添加到DOM
  chartBars.appendChild(chartContainer);
}

// 保存当前状态
function saveCurrentState() {
  // 获取当前时间作为状态ID
  const stateId = new Date().toISOString();
  
  // 创建一个保存的状态对象
  const savedState = {
    id: stateId,
    name: `保存于 ${new Date().toLocaleString()}`,
    counters: JSON.parse(JSON.stringify(counters)), // 深拷贝
    timestamp: Date.now()
  };
  
  // 获取之前保存的状态列表
  let savedStates = JSON.parse(localStorage.getItem('savedStates') || '[]');
  
  // 限制最多保存10个状态
  if (savedStates.length >= 10) {
    savedStates.shift(); // 移除最旧的
  }
  
  // 添加新状态
  savedStates.push(savedState);
  
  // 保存到localStorage
  localStorage.setItem('savedStates', JSON.stringify(savedStates));
  
  // 更新下拉菜单
  updateSavedStatesDropdown();
  
  // 显示成功消息
  const numStates = savedStates.length;
  alert(`当前状态已保存！\n\n共有 ${numStates} 个已保存状态\n最新状态ID: ${stateId.slice(0, 10)}`);
  
  return savedState;
}

// 更新已保存状态下拉菜单
function updateSavedStatesDropdown() {
  console.log('更新下拉菜单开始, DOM元素:', savedStatesSelect);
  if (!savedStatesSelect) {
    console.error('无法更新下拉菜单：元素未找到');
    return;
  }
  
  try {
    // 保存当前选中的值（如果有）
    const currentSelectedValue = savedStatesSelect.value;
    console.log('当前选中值:', currentSelectedValue);
    
    // 完全清空下拉菜单
    savedStatesSelect.innerHTML = '';
    console.log('已清空下拉菜单内容');
    
    // 添加默认选项
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '- 选择已保存的状态 -';
    savedStatesSelect.appendChild(defaultOption);
    
    // 获取保存的状态
    const savedStates = JSON.parse(localStorage.getItem('savedStates') || '[]');
    console.log('读取到已保存状态:', savedStates.length, '个');
    
    if (savedStates.length === 0) {
      const emptyOption = document.createElement('option');
      emptyOption.disabled = true;
      emptyOption.textContent = '没有已保存的状态';
      savedStatesSelect.appendChild(emptyOption);
      console.log('没有状态，添加提示选项');
      return;
    }
    
    // 按时间排序（最新的在前面）
    savedStates.sort((a, b) => b.timestamp - a.timestamp);
    
    // 添加每个状态作为选项
    savedStates.forEach(state => {
      const option = document.createElement('option');
      option.value = state.id;
      option.textContent = state.name;
      savedStatesSelect.appendChild(option);
      console.log('添加选项:', state.id, state.name);
    });
    
    // 尝试恢复之前的选择
    if (currentSelectedValue) {
      // 检查选项是否仍然存在
      const optionExists = Array.from(savedStatesSelect.options)
        .some(option => option.value === currentSelectedValue);
      
      if (optionExists) {
        savedStatesSelect.value = currentSelectedValue;
        console.log('已恢复之前的选择:', currentSelectedValue);
      } else {
        console.log('无法恢复之前的选择，选项已不存在');
      }
    }
    
    console.log('下拉菜单更新完成，当前选中值:', savedStatesSelect.value);
  } catch (error) {
    console.error('更新下拉菜单时出错:', error);
  }
}

// 加载选中的状态
function loadSavedState() {
  const selectedStateId = savedStatesSelect.value;
  
  if (!selectedStateId) {
    alert('请先选择一个已保存的状态');
    return;
  }
  
  // 获取保存的状态
  const savedStates = JSON.parse(localStorage.getItem('savedStates') || '[]');
  const selectedState = savedStates.find(state => state.id === selectedStateId);
  
  if (!selectedState) {
    alert('找不到所选状态，可能已被删除');
    updateSavedStatesDropdown();
    return;
  }
  
  // 确认加载
  if (confirm(`确定要加载"${selectedState.name}"吗？\n这将替换当前所有计数器数据。`)) {
    // 替换当前数据
    counters = JSON.parse(JSON.stringify(selectedState.counters)); // 深拷贝
    saveCounters();
    
    // 重置选中的计数器
    selectedCounterId = null;
    
    // 更新UI
    renderCountersList();
    renderCounterDetails(null);
    
    // 如果图表已显示，则更新图表
    if (chartContainer.style.display === 'block') {
      updateChart();
    }
    
    alert('已成功加载保存的状态！');
  }
}

// 删除选中的状态
function deleteSelectedState() {
  const selectedStateId = savedStatesSelect.value;
  
  if (!selectedStateId) {
    alert('请先选择一个已保存的状态');
    return;
  }
  
  // 获取保存的状态
  let savedStates = JSON.parse(localStorage.getItem('savedStates') || '[]');
  const selectedState = savedStates.find(state => state.id === selectedStateId);
  
  if (!selectedState) {
    alert('找不到所选状态，可能已被删除');
    updateSavedStatesDropdown();
    return;
  }
  
  // 确认删除
  if (confirm(`确定要删除"${selectedState.name}"吗？\n此操作无法撤销。`)) {
    // 从数组中移除
    savedStates = savedStates.filter(state => state.id !== selectedStateId);
    
    // 保存到localStorage
    localStorage.setItem('savedStates', JSON.stringify(savedStates));
    
    // 更新下拉菜单
    updateSavedStatesDropdown();
    
    alert('已成功删除所选状态！');
  }
}

// 导出图表为图片
function exportChart() {
  // 确保图表已显示
  if (chartContainer.style.display !== 'block') {
    alert('请先显示图表再导出');
    return;
  }
  
  // 使用DOM原生API导出图表为图片
  try {
    const chartElement = chartBars.querySelector('div');
    
    // 使用canvas原生API
    html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // 提高分辨率
      useCORS: true
    }).then(canvas => {
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `计数器统计图-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(err => {
      console.error('图表导出失败:', err);
      alert('图表导出失败: ' + err.message);
    });
  } catch (error) {
    console.error('图表导出过程中发生错误:', error);
    alert('图表导出失败: ' + error.message);
  }
}

// 显示图表
function showChart() {
  // 显示图表容器
  chartContainer.style.display = 'block';
  
  // 更新图表
  updateChart();
  
  // 滚动到图表位置
  chartContainer.scrollIntoView({ behavior: 'smooth' });
}

// 事件监听
console.log('添加事件监听器...');
console.log('添加按钮元素:', addCounterBtn);

// 添加一个包装函数，确保所有事件监听器在DOM完全加载后添加
function addAllEventListeners() {
  console.log('添加所有事件监听器...');
  
  try {
    // 为添加按钮添加点击事件
    addCounterBtn.addEventListener('click', (e) => {
      console.log('添加按钮被点击');
      const value = newCounterNameInput.value;
      console.log('输入框值:', value);
      addCounter(value);
    });
    
    // 为输入框添加回车键事件
    newCounterNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        console.log('输入框中按下回车键');
        addCounter(newCounterNameInput.value);
      }
    });
    
    showChartBtn.addEventListener('click', showChart);
    
    // 导出和导入数据事件监听器
    exportDataBtn.addEventListener('click', exportData);
    
    importDataBtn.addEventListener('click', () => {
      // 触发文件选择对话框
      fileInput.click();
    });
    
    // 监听文件选择
    fileInput.addEventListener('change', (event) => {
      if (event.target.files.length > 0) {
        importData(event.target.files[0]);
        // 重置文件输入，以便可以重复选择同一个文件
        fileInput.value = '';
      }
    });
    
    // 导出图表事件监听器
    exportChartBtn.addEventListener('click', exportChart);
    
    // 保存当前状态事件监听器
    saveStateBtn.addEventListener('click', () => {
      saveCurrentState();
    });
    
    // 加载已保存状态事件监听器
    loadStateBtn.addEventListener('click', loadSavedState);
    
    // 删除已保存状态事件监听器
    deleteStateBtn.addEventListener('click', deleteSelectedState);
    
    // 新建计数器列表事件监听器
    newListBtn.addEventListener('click', createNewCounterList);
    
    // 重命名状态事件监听器
    console.log('开始添加重命名状态按钮事件监听器，按钮元素:', renameStateBtn);
    if (renameStateBtn) {
      console.log('直接添加重命名按钮事件监听器');
      
      // 移除所有现有事件监听器（避免重复）
      const newRenameBtn = renameStateBtn.cloneNode(true);
      renameStateBtn.parentNode.replaceChild(newRenameBtn, renameStateBtn);
      renameStateBtn = newRenameBtn;
      
      // 添加新的事件监听器
      renameStateBtn.addEventListener('click', function(event) {
        console.log('重命名按钮被点击', event);
        renameSelectedState();
      });
      
      // 添加内联事件处理器作为备份
      renameStateBtn.onclick = function() {
        console.log('重命名按钮onclick被触发');
        renameSelectedState();
        return true;
      };
      
      console.log('已添加重命名按钮事件处理器');
    } else {
      console.error('无法找到重命名按钮元素!');
    }
    
    console.log('所有事件监听器添加完成');
  } catch (error) {
    console.error('添加事件监听器时出错:', error);
  }
}

// 使用DOMContentLoaded事件确保DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM内容加载完成，开始添加事件监听器');
  
  // 重新获取DOM元素，确保元素已被加载
  renameStateBtn = document.getElementById('rename-state-btn');
  console.log('重命名按钮DOM元素 (DOMContentLoaded):', renameStateBtn);
  
  // 显式添加重命名按钮的事件监听器
  if (renameStateBtn) {
    console.log('直接添加重命名按钮事件监听器');
    
    // 移除所有现有事件监听器（避免重复）
    const newRenameBtn = renameStateBtn.cloneNode(true);
    renameStateBtn.parentNode.replaceChild(newRenameBtn, renameStateBtn);
    renameStateBtn = newRenameBtn;
    
    // 添加新的事件监听器
    renameStateBtn.addEventListener('click', function(event) {
      console.log('重命名按钮被点击', event);
      renameSelectedState();
    });
    
    // 添加内联事件处理器作为备份
    renameStateBtn.onclick = function() {
      console.log('重命名按钮onclick被触发');
      renameSelectedState();
      return true;
    };
    
    console.log('已添加重命名按钮事件处理器');
  } else {
    console.error('无法找到重命名按钮元素!');
  }
  
  addAllEventListeners();
  
  // 初始化渲染
  renderCountersList();
  
  // 如果有计数器，默认选择第一个
  if (counters.length > 0) {
    selectCounter(counters[0].id);
  } else {
    renderCounterDetails(null);
  }
  
  // 添加初始计数器（如果没有）
  if (counters.length === 0) {
    addCounter('示例计数器');
  }
  
  // 初始化加载已保存状态下拉菜单
  updateSavedStatesDropdown();
});

// 新建计数器列表功能 - 保留名称但重置所有数值为0
function createNewCounterList() {
  // 如果当前没有计数器，无需操作
  if (counters.length === 0) {
    alert('当前没有计数器可以重置');
    return;
  }
  
  // 询问用户确认
  if (!confirm('确定要创建新的计数器列表吗？\n这将保留所有计数器名称，但把所有数值重置为0。')) {
    return;
  }
  
  // 创建新的计数器数组，保留原有名称但将值设为0
  const newCounters = counters.map(counter => ({
    id: Date.now() + '-' + Math.random().toString(36).substr(2, 9), // 创建新ID
    name: counter.name,
    value: 0
  }));
  
  // 备份旧数据（可选）
  const backupDate = new Date().toISOString().slice(0, 19).replace(/T/g, ' ');
  const backupName = `备份-${backupDate}`;
  
  if (confirm(`是否要保存当前计数器状态到"${backupName}"？`)) {
    // 创建一个保存的状态对象
    const savedState = {
      id: Date.now().toString(),
      name: backupName,
      counters: JSON.parse(JSON.stringify(counters)), // 深拷贝
      timestamp: Date.now()
    };
    
    // 获取之前保存的状态列表
    let savedStates = JSON.parse(localStorage.getItem('savedStates') || '[]');
    
    // 限制最多保存10个状态
    if (savedStates.length >= 10) {
      savedStates.shift(); // 移除最旧的
    }
    
    // 添加新状态
    savedStates.push(savedState);
    
    // 保存到localStorage
    localStorage.setItem('savedStates', JSON.stringify(savedStates));
    
    // 更新下拉菜单
    updateSavedStatesDropdown();
  }
  
  // 更新计数器数据
  counters = newCounters;
  saveCounters();
  
  // 更新UI
  renderCountersList();
  
  // 如果有选中的计数器，重新选中同名计数器
  if (selectedCounterId) {
    const oldCounter = counters.find(c => c.id === selectedCounterId);
    if (oldCounter) {
      // 找到新列表中同名的第一个计数器
      const newCounter = newCounters.find(c => c.name === oldCounter.name);
      if (newCounter) {
        selectCounter(newCounter.id);
      } else {
        renderCounterDetails(null);
      }
    } else {
      renderCounterDetails(null);
    }
  }
  
  // 如果图表已显示，则更新图表
  if (chartContainer.style.display === 'block') {
    updateChart();
  }
  
  alert('已成功创建新的计数器列表，所有数值已重置为0');
}

// 重命名选中的状态
function renameSelectedState() {
  console.log('重命名状态函数被调用');
  
  const selectedStateId = savedStatesSelect.value;
  console.log('选中的状态ID:', selectedStateId);
  
  if (!selectedStateId) {
    alert('请先选择一个已保存的状态');
    return;
  }
  
  // 获取保存的状态
  let savedStates = JSON.parse(localStorage.getItem('savedStates') || '[]');
  const selectedState = savedStates.find(state => state.id === selectedStateId);
  
  if (!selectedState) {
    alert('找不到所选状态，可能已被删除');
    updateSavedStatesDropdown();
    return;
  }
  
  // 创建并显示自定义对话框
  createCustomRenameDialog(selectedState.name, function(newName) {
    if (newName === null || newName.trim() === '') {
      return;
    }
    
    // 更新状态名称
    selectedState.name = newName.trim();
    
    // 保存到localStorage
    localStorage.setItem('savedStates', JSON.stringify(savedStates));
    
    // 更新下拉菜单
    updateSavedStatesDropdown();
    
    // 恢复选择
    savedStatesSelect.value = selectedStateId;
    
    alert(`已成功将状态重命名为"${newName.trim()}"!`);
  });
}

// 创建自定义重命名对话框
function createCustomRenameDialog(currentName, callback) {
  // 创建对话框容器
  const dialogOverlay = document.createElement('div');
  dialogOverlay.style.position = 'fixed';
  dialogOverlay.style.top = '0';
  dialogOverlay.style.left = '0';
  dialogOverlay.style.width = '100%';
  dialogOverlay.style.height = '100%';
  dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  dialogOverlay.style.zIndex = '9999';
  dialogOverlay.style.display = 'flex';
  dialogOverlay.style.justifyContent = 'center';
  dialogOverlay.style.alignItems = 'center';
  
  // 创建对话框
  const dialog = document.createElement('div');
  dialog.style.backgroundColor = 'white';
  dialog.style.padding = '20px';
  dialog.style.borderRadius = '8px';
  dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  dialog.style.width = '300px';
  
  // 创建标题
  const title = document.createElement('h3');
  title.textContent = '重命名状态';
  title.style.marginTop = '0';
  title.style.marginBottom = '15px';
  
  // 创建输入框
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.style.width = '100%';
  input.style.padding = '8px';
  input.style.marginBottom = '15px';
  input.style.boxSizing = 'border-box';
  input.style.border = '1px solid #ddd';
  input.style.borderRadius = '4px';
  
  // 创建按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'flex-end';
  buttonContainer.style.gap = '10px';
  
  // 创建取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.textContent = '取消';
  cancelButton.style.padding = '5px 10px';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '4px';
  cancelButton.style.backgroundColor = '#f44336';
  cancelButton.style.color = 'white';
  cancelButton.style.cursor = 'pointer';
  
  // 创建确定按钮
  const confirmButton = document.createElement('button');
  confirmButton.textContent = '确定';
  confirmButton.style.padding = '5px 10px';
  confirmButton.style.border = 'none';
  confirmButton.style.borderRadius = '4px';
  confirmButton.style.backgroundColor = '#4CAF50';
  confirmButton.style.color = 'white';
  confirmButton.style.cursor = 'pointer';
  
  // 添加按钮事件
  cancelButton.addEventListener('click', function() {
    document.body.removeChild(dialogOverlay);
    callback(null);
  });
  
  confirmButton.addEventListener('click', function() {
    document.body.removeChild(dialogOverlay);
    callback(input.value);
  });
  
  // 添加回车键事件
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.body.removeChild(dialogOverlay);
      callback(input.value);
    }
  });
  
  // 组装对话框
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(confirmButton);
  
  dialog.appendChild(title);
  dialog.appendChild(input);
  dialog.appendChild(buttonContainer);
  
  dialogOverlay.appendChild(dialog);
  
  // 显示对话框
  document.body.appendChild(dialogOverlay);
  
  // 输入框获取焦点并选中所有文本
  setTimeout(function() {
    input.focus();
    input.select();
  }, 100);
}

// 将函数暴露给全局作用域，使HTML可以直接调用
window.renameSelectedState = renameSelectedState;

// 切换重命名工具iframe的显示/隐藏
window.toggleRenameToolIframe = function() {
  const container = document.getElementById('rename-tool-container');
  const button = document.getElementById('toggle-rename-btn');
  
  if (container.style.display === 'none') {
    container.style.display = 'block';
    button.textContent = '隐藏重命名工具';
    
    // 刷新iframe确保内容最新
    const iframe = document.getElementById('rename-tool-iframe');
    iframe.src = iframe.src;
  } else {
    container.style.display = 'none';
    button.textContent = '展开重命名工具';
  }
}; 