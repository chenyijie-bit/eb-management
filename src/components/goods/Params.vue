<template>
  <div class="page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        show-icon
        title="注意:只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  style="margin-right:10px;"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  style="margin-right:10px;"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedCateKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(",")
        }
      );
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error"
        });
        return;
      }

      this.$message({
        message: "修改成功",
        type: "success"
      });
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    showInput(row) {
      let vm = this;
      row.inputVisible = true;
      this.$nextTick(() => {
        vm.$refs.saveTagInput.focus();
      });
    },

    async removeParams(attr_id) {
      const result = await this.$alert(
        "此操作将永久删除该参数，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(e => e);
      if (result !== "confirm") {
        this.$message({
          message: "已取消删除",
          type: "error"
        });
        return;
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error"
        });
        return;
      }
      this.$message({
        message: "删除成功",
        type: "success"
      });
      this.getParamsData();
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          this.$message({
            message: res.meta.msg,
            type: "error"
          });
          return;
        }
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async showEditDialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error"
        });
        return;
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error"
        });
        return;
      }
      this.cateList = res.data;
    },
    async handleChange() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error"
        });
        return;
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    handleTabClick() {
      this.getParamsData();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          this.$message({
            message: res.meta.msg,
            type: "error"
          });
          return;
        }
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.addDialogVisible = false;
        this.getParamsData();
      });
    }
  }
};
</script>

<style scoped lang="less">
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  margin-left: 15px;
}
.input-new-tag {
  width: 150px;
}
</style>
