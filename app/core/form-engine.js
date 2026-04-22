export class FormEngine {

  /** Maps prompt type names → emoji icons */
  static ICONS = {
    'itp':  '📋',
    'mos':  '📐',
    'chk':  '✅',
  };

  static TILE_DESCRIPTIONS = {
    'Inspection & Testing Plan - ITP': 'Tabular QA/QC lifecycle plan with stakeholder roles',
    'Method of Statement - MOS':        'Structured execution methodology & HSE controls',
    'Inspection Checklists':            'Field-ready hierarchical site inspection checklists',
  };

  /**
   * Render selector tiles into #selectorGrid
   * @param {Array}    registry  - array of { name, file }
   * @param {Function} onSelect  - called with the selected item
   */
  renderSelector(registry, onSelect) {
    const grid = document.getElementById('selectorGrid');
    grid.innerHTML = '';

    registry.forEach((item, idx) => {
      const id     = item.file.replace('.json', '');
      const icon   = FormEngine.ICONS[id] || '📄';
      const desc   = FormEngine.TILE_DESCRIPTIONS[item.name] || '';

      const tile = document.createElement('button');
      tile.className   = 'selector-tile';
      tile.dataset.file = item.file;
      tile.style.animationDelay = `${idx * 80}ms`;
      tile.innerHTML = `
        <span class="tile-icon">${icon}</span>
        <div class="tile-name">${item.name}</div>
        <div class="tile-sub">${desc}</div>
        <span class="tile-check">✓</span>
      `;

      tile.addEventListener('click', () => {
        document.querySelectorAll('.selector-tile').forEach(t => t.classList.remove('active'));
        tile.classList.add('active');
        onSelect(item);
      });

      grid.appendChild(tile);
    });
  }

  /**
   * Render form fields into #formArea based on schema
   * @param {Object} schema
   */
  render(schema) {
    const container = document.getElementById('formArea');
    container.innerHTML = '';

    schema.fields.forEach(f => {
      const group = document.createElement('div');
      group.className = 'field-group';

      const label = document.createElement('label');
      label.className = 'field-label';
      label.setAttribute('for', `field_${f.name}`);
      label.textContent = f.label;
      group.appendChild(label);

      let control;

      if (f.type === 'text') {
        control = document.createElement('input');
        control.type = 'text';
        control.id = `field_${f.name}`;
        control.className = 'field-input';
        control.placeholder = `Enter ${f.label.toLowerCase()}...`;

      } else if (f.type === 'textarea') {
        control = document.createElement('textarea');
        control.id = `field_${f.name}`;
        control.className = 'field-textarea';
        control.placeholder = `Enter ${f.label.toLowerCase()}...`;

      } else if (f.type === 'dropdown') {
        control = document.createElement('select');
        control.id = `field_${f.name}`;
        control.className = 'field-select';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.disabled = true;
        placeholder.selected = true;
        placeholder.textContent = `Select ${f.label}...`;
        control.appendChild(placeholder);
        f.options.forEach(o => {
          const opt = document.createElement('option');
          opt.value = o;
          opt.textContent = o;
          control.appendChild(opt);
        });

      } else if (f.type === 'multiselect') {
        // Header row
        const header = document.createElement('div');
        header.className = 'multiselect-header';

        const count = document.createElement('span');
        count.className = 'multiselect-count';
        count.id = `count_${f.name}`;
        count.textContent = `${f.options.length} / ${f.options.length} selected`;

        const controls = document.createElement('div');
        controls.className = 'multiselect-controls';

        const allBtn  = document.createElement('button');
        allBtn.type = 'button';
        allBtn.className = 'ms-ctrl-btn';
        allBtn.textContent = 'All';

        const noneBtn = document.createElement('button');
        noneBtn.type = 'button';
        noneBtn.className = 'ms-ctrl-btn';
        noneBtn.textContent = 'None';

        controls.append(allBtn, noneBtn);
        header.append(count, controls);
        group.appendChild(header);

        // Chip container
        const wrap = document.createElement('div');
        wrap.className = 'chips-wrap';
        wrap.id = `field_${f.name}`;

        const updateCount = () => {
          const selected = wrap.querySelectorAll('.chip.selected').length;
          count.textContent = `${selected} / ${f.options.length} selected`;
        };

        f.options.forEach(opt => {
          const chip = document.createElement('span');
          chip.className = 'chip selected';   // pre-selected, matching web app
          chip.dataset.value = opt;
          chip.textContent = opt;
          chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
            updateCount();
          });
          wrap.appendChild(chip);
        });

        allBtn.addEventListener('click', () => {
          wrap.querySelectorAll('.chip').forEach(c => c.classList.add('selected'));
          updateCount();
        });
        noneBtn.addEventListener('click', () => {
          wrap.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
          updateCount();
        });

        group.appendChild(wrap);
        container.appendChild(group);
        return; // skip the generic control.id path below
      }

      group.appendChild(control);
      container.appendChild(group);
    });
  }

  /**
   * Collect current form values
   * @param {Object} schema
   * @returns {Object} key → value string map
   */
  collect(schema) {
    const data = {};

    schema.fields.forEach(f => {
      if (f.type === 'multiselect') {
        const wrap = document.getElementById(`field_${f.name}`);
        if (!wrap) return;
        data[f.name] = Array.from(wrap.querySelectorAll('.chip.selected'))
          .map(c => c.dataset.value)
          .join(', ');
      } else {
        const el = document.getElementById(`field_${f.name}`);
        if (!el) return;
        data[f.name] = el.value;
      }
    });

    return data;
  }
}
