<template>
  <div class="el-select">
    <el-popover
      ref="popover"
      placement="bottom"
      visible-arrow="false"
      width="220"
      trigger="focus">
      <el-scrollbar
        tag="div"
        wrap-class="el-select-dropdown__wrap"
        view-class="el-select-dropdown__list"
        class='is-empty'
        v-show="treeData && !loading">
        <el-tree :data="treeData" ref="tree"
                 :show-checkbox="multiple"
                 node-key="id"
                 check-strictly
                 :props="propNames"
                 :render-content="renderContent"
                 @check-change="handleCheckChange"
                 @node-click="handleTreeNodeClick">
        </el-tree>
      </el-scrollbar>
    </el-popover>
    <el-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      suffix-icon="el-icon-arrow-down"
      :size="size"
      :disabled="disabled"
      :readonly="multiple"
      :validate-event="false"
      v-popover:popover
      style="background-color: transparent;"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      :icon="iconClass">
    </el-input>
  </div>
</template>

<script type="text/babel">
  import merge from 'element-ui/lib/utils/merge';
  import treeter from "../components/treeter"

  const sizeMap = {
    'large': 42,
    'small': 30,
    'mini': 22
  };

  export default {
    mixins: [treeter],

    computed: {
      iconClass() {
        let criteria = this.clearable && !this.disabled &&
          this.inputHovering && !this.multiple &&
          this.value !== undefined && this.value != null &&
          this.value !== '';
        return criteria ? 'circle-close is-show-close' : 'caret-top';
      },

    },

    props: {
      name: String,
      value: {},
      treeData: Array,
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      loading: Boolean,
      popperClass: String,
      loadingText: String,
      noDataText: String,
      multiple: Boolean,
      propNames: {
        type: Object,
        default(){
          return {children: 'children', label: 'label', id: 'id'}
        }
      },
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default() {
          return t('el.select.placeholder');
        }
      }
    },

    data() {
      return {
        selected: this.multiple ? [] : {},
        inputLength: 20,
        inputWidth: 0,
        currentPlaceholder: '',
        dropdownUl: null,
        visible: false,
        selectedLabel: '',
        bottomOverflow: 0,
        topOverflow: 0,
        inputHovering: false,
      };
    },

    watch: {
      value(val) {
        this.handleResize();
        if (!!val) {
          this.currentPlaceholder = '';
        } else {
          this.currentPlaceholder = this.placeholder;
        }
        this.setSelected(val);
        this.$emit('change', val);
       /* this.dispatch('ElFormItem', 'el.form.change', val);*/
      },

    },

    methods: {
      renderContent(h, {node, data, store}) {

        return ( <span>
                    <span>
                      <el-tooltip placement="bottom" effect="light" open-delay={1000}>
                        <div slot="content">{node.label}</div>
                        <span class="xing">{node.label}</span>
                       </el-tooltip>
                    </span>
                </span>);
      },
      setSelected(ids) {
        if (!!ids) {
          if (this.multiple) {
            this.$refs.tree.setCheckedKeys(ids);
            this.selected = this.$refs.tree.getCheckedNodes();
          } else {
            this.selected = this.findFromTree(this.treeData, ids, this.propNames.id, this.propNames.children);
            this.selectedLabel = !!this.selected ? this.selected[this.propNames.label] : '';
          }
        } else {
          this.selected = this.multiple ? [] : {};
          this.selectedLabel = '';
        }
      },

      handleTreeNodeClick(nodeData) {
        if (this.multiple) return;
        console.log(nodeData);
        this.$emit('input', nodeData.id);
        this.visible = false;
        this.selectedLabel = nodeData[this.propNames.label];
        this.selected = nodeData;
        this.handleResize();
      },
      handleCheckChange(data, checked, indeterminate) {
        if (!this.multiple) return;
        this.selected = this.$refs.tree.getCheckedNodes();
        let tmpValue = [];
        if (this.selected) {
          this.selected.forEach((item, index) => {
            tmpValue.push(item.id);
          });
        }
        this.$emit('input', tmpValue);
        this.handleResize();
      },

      deleteSelected(event) {
        event.stopPropagation();
        this.$emit('input', '');
        this.selected = {};
        this.selectedLabel = '';
        this.visible = false;
      },

      resetInputWidth() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },

      handleResize() {
        this.resetInputWidth();
        if (this.multiple) {
          this.resetInputHeight();
        } else {
          this.inputLength = 20;
        }
      }
    },

    created() {
      if (this.multiple && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }
      if (!this.multiple && Array.isArray(this.value)) {
        this.$emit('input', '');
      }
      this.setSelected();
      this.$on('setSelected', this.setSelected);
    },

    mounted() {
      this.$nextTick(() => {
        if (this.$refs.reference && this.$refs.reference.$el) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      });
    },
  };
</script>
<style>
  .xing{
    display: block;
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
