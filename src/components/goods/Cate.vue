<template>
  <div class="page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button
            type="primary"
            style="margin-bottom:15px;"
            @click="showAddCateDialog"
          >
            添加分类</el-button
          >
        </el-col>
      </el-row>
      <zk-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mimi" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mimi"
            v-else-if="scope.row.cat_level === 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mimi" v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="primary" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </zk-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称:" prop="cat_name" label-width="100px">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" label-width="100px">
          <el-cascader
            expand-trigger="hover"
            v-model="selectedOptions2"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
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
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      },
      parentCateList: [],
      selectedOptions2: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error"
        });
        return;
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagenum = 1;
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      this.addCateDialogVisible = true;
      this.getParentCateList();
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error"
        });
        return;
      }
      this.parentCateList = res.data;
    },
    parentCateChange() {
      if (this.selectedOptions2.length > 0) {
        this.addCateForm.cat_pid = this.selectedOptions2[
          this.selectedOptions2.length - 1
        ];
        this.addCateForm.cat_level = this.selectedOptions2.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
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
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedOptions2 = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    }
  }
};
</script>

<style scoped lang="less">
.el-cascader {
  width: 100%;
}
</style>
