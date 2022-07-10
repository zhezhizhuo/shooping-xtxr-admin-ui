<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--分类数据数据-->
      <el-col :span="3" :xs="24">
        <div class="head-container">
          <el-input
            v-model="categoryName"
            placeholder="请输入分类名"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree

            :data="categoryOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>


      </el-col>

      <!--商品数据-->
      <el-col :span="20" :xs="24">


        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="商品名称" prop="productName">
            <el-input
              v-model="queryParams.productName"
              placeholder="请输入商品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input
              v-model="queryParams.price"
              placeholder="请输入商品价格"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品状态" prop="pStatus">
            <el-select v-model="queryParams.pStatus" placeholder="请选择商品状态" clearable>
              <el-option
                v-for="dict in dict.type.product_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['product:product:add']"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['product:product:edit']"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['product:product:remove']"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['product:product:export']"
            >导出
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="商品名称" align="center" prop="productName"/>
          <el-table-column label="商品价格" align="center" prop="price"/>
          <el-table-column label="商品状态" width="100" align="center" prop="pStatus">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.product_status" :value="scope.row.pStatus"/>
            </template>
          </el-table-column>
          <el-table-column label="商品描述" align="center" prop="descript"/>
          <el-table-column label="所属类目" align="center" prop="categoryName"/>
          <el-table-column label="上架时间" sortable align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品主图" align="center" prop="picture" width="100">
            <template slot-scope="scope">
              <image-preview :src="scope.row.picture" :width="50" :height="50"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['product:product:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['product:product:remove']"
              >删除
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handlePrices(scope.row)"
                v-hasPermi="['product:product:edit']"
              >修改子图片
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>

    </el-row>

    <!-- 添加或修改商品信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称"/>
        </el-form-item>
        <el-form-item label="所属类目" prop="categoryName">
          <treeselect @select="selectCategory" v-model="form.categoryId" :options="categoryOptions" :show-count="true"
                      placeholder="请选择所属类目"/>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="form.price"  type="number" placeholder="请输入商品价格"/>
        </el-form-item>
        <el-form-item label="商品状态" prop="pStatus">
          <el-select v-model="form.pStatus" placeholder="请选择商品状态">
            <el-option
              v-for="dict in dict.type.product_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="descript">
          <el-input v-model="form.descript" type="textarea" placeholder="请输入内容"/>
        </el-form-item>

        <el-form-item label="商品主图">
          <image-upload :limit="limit" v-model="form.picture"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="title" :visible.sync="img" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="商品图片">
          <div style="display: flex; flex-wrap: wrap;">
            <image-upload style="margin: 5px 10px" :isShowTip="false" :limit="limit" v-for="(item,index) in imgParams.imgs"
                          v-model="item.img" :key="index"/>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPictures">确 定</el-button>
        <el-button @click="Picturescancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {
  listProduct,
  getProductImgs,
  getProduct,
  delProduct,
  addProduct,
  addImgs,
  updateProduct
} from "@/api/product/product/product";
import {treeselect} from "@/api/product/category/category";
import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "Product",
  dicts: ['product_status'],
  components: {Treeselect},
  data() {
    return {
      pictures: 5,
      limit: 1,
      img: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 商品信息表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 类目树选项
      categoryOptions: undefined,
      // 是否显示弹出层
      open: false,
      imgParams: {
        productId: undefined,
        imgs: [
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          },
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          }     ,
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          }    ,
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          }  ,
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          }
        ]
      },
      // 类目名称
      categoryName: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        categoryId: null,
        price: null,
        pStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productName: [
          {required: true, message: "商品名称不能为空", trigger: "blur"}
        ],
        price: [
          {required: true, message: "商品价格不能为空", trigger: "blur"}
        ],
        pStatus: [
          {required: true, message: "商品状态不能为空", trigger: "change"}
        ],
        descript: [
          {required: true, message: "商品描述不能为空", trigger: "blur"}
        ],
        categoryName: [
          {required: true, message: "所属类目不能为空", trigger: "blur"}
        ],
        categoryId: [
          {required: true, message: "类目ID不能为空", trigger: "blur"}
        ],
        createTime: [
          {required: true, message: "上架时间不能为空", trigger: "blur"}
        ],
        picture: [
          {required: true, message: "商品图片不能为空", trigger: "blur"}
        ]
      }
    };
  }, watch: {
    // 根据名称筛选树
    categoryName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询商品信息列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then(response => {
        this.productList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    }, selectCategory(node) {
      //下拉类目选项回调
      this.form.categoryName = node.label;
      console.log(node.label)
    }, /** 查询分类下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.categoryOptions = response.data;
      });
    }, handlePrices(row) {
      this.imgsRest();
      const productId = row.productId || this.ids
      //发送请求查询子图片

      getProductImgs(productId).then(response => {
        if(response.data.length ==0){
                       this.imgsRest();
        } else {
          // this.imgParams.imgs = response.data;
          for (let i = 0; i < response.data.length; i++) {
            this.imgParams.imgs[i].img = response.data[i].img;
          }
        }
        this.imgParams.productId =productId;

        //添加参数
        this.img = true;
        this.title = "修改子图片";
      });

    }, handleStatus(row) {

    },    // 筛选节点
    filterNode(value, data) {
      console.log(value, data)
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.categoryId = data.id;
      this.handleQuery();
      console.log(data)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        productId: null,
        productName: null,
        price: null,
        pStatus: null,
        descript: null,
        categoryName: null,
        categoryId: null,
        createTime: null,
        picture: null
      };
      this.queryParams.categoryId = null
      this.resetForm("form");
    },  //图片充值
    imgsRest() {
      this.imgParams = {
        productId: undefined,
        imgs: [
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          },
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          }     ,
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          }    ,
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          }  ,
          {
            addTime: "2022-04-20 17:41:07",
            id: 7 ,
            img: ""     ,
          }
        ]
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        categoryId: null,
        price: null,
        pStatus: null,
      };
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.productId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const productId = row.productId || this.ids
      getProduct(productId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品信息";
      });
    }, /** 图片提交按钮 */
    submitPictures() {
      //修改图片
      addImgs(this.imgParams).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.img = false;
        this.getList();
      });
    }, Picturescancel() {
      this.img = false;
      this.imgsRest();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.productId != null) {
            updateProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const productIds = row.productId || this.ids;
      this.$modal.confirm('是否确认删除商品信息编号为"' + productIds + '"的数据项？').then(function () {
        return delProduct(productIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('product/product/export', {
        ...this.queryParams
      }, `product_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
