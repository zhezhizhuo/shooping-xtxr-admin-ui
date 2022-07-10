<template>
  <div class="app-container">

    <el-table v-loading="loading" :data="productList" >
      <el-table-column label="商品名称" width="340"align="center" prop="productName" />

      <el-table-column label="商品描述" align="center" prop="descript" />

      <el-table-column label="商品图片" align="center" prop="picture" width="200">
        <template slot-scope="scope">
          <image-preview :src="scope.row.picture" :width="50" :height="50"/>
        </template>
      </el-table-column>
    <el-table-column label="商品热度"   align="center" >

      <el-table-column label="商品浏览次数"  align="center" prop="footCount" />

      <el-table-column label="商品的收藏次数" align="center" prop="collectsCount" />

      <el-table-column label="商品的评论次数" align="center" prop="commentCount" />
                </el-table-column>
      <el-table-column label="总热度"   align="center" prop="hot" />


    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listHots } from "@/api/product/product/product";

export default {
  name: "Product",
  dicts: ['product_status'],
  data() {
    return {
      total: 0,
      // 商品信息表格数据
      productList: [],
      loading:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品信息列表 */
    getList() {
      this.loading = true;
      listHots(this.queryParams).then(response => {
        this.productList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    }
  }
};
</script>
