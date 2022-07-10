<template>
  <div class="app-container">

    <el-table v-loading="loading" :data="productList" >
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品价格" align="center" prop="price" />

      <el-table-column label="商品描述" align="center" prop="descript" />
      <el-table-column label="所属类目" align="center" prop="categoryName" />
      <el-table-column label="上架时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" align="center" prop="picture" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.picture" :width="50" :height="50"/>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
import { listNews } from "@/api/home/home/index";

export default {
  name: "Product",
  dicts: ['product_status'],
  data() {
    return {
      total: 0,
      // 商品信息表格数据
      productList: [],
      loading:false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品信息列表 */
    getList() {
      this.loading = true;
      listNews().then(response => {
        this.productList = response.data;
        this.total = response.total;
        this.loading = false;
      });
    }
  }
};
</script>
