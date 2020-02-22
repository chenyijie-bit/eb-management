<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle" @click="toggleCollapses">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="menuItem in item.children"
              :key="menuItem.id"
              :index="'/' + menuItem.path"
              @click="saveNavState('/' + menuItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ menuItem.authName }} </span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      iscollapse: false,
      menulist: [],
      iconsObj: {
        "125": "iconfont icon-LC_icon_user_group_fill",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpingouwudai2",
        "102": "iconfont icon-danju-tianchong",
        "145": "iconfont icon-baobiao2"
      },
      activePath: window.sessionStorage.getItem("active") || ""
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      let { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200) {
        return this.$message({ message: res.meta.msg, type: "error" });
      }
      this.menulist = res.data;
    },
    toggleCollapses() {
      this.iscollapse = !this.iscollapse;
    },
    saveNavState(e) {
      window.sessionStorage.setItem("active", e);
      this.activePath = e;
    }
  }
};
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
}
.el-menu {
  border: none;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  overflow: hidden;
  img {
    display: inline-block;
    padding: 10px;
    box-sizing: border-box;
    height: 50px;
    width: 50px;
  }
  div {
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #fff;
}
.iconfont {
  margin-right: 10px;
  font-size: 16px;
}
.toggle {
  color: #fff;
  text-align: center;
  padding: 8px;
  font-size: 13px;
  cursor: pointer;
  background: #4a5064;
  letter-spacing: 2px;
}
</style>
