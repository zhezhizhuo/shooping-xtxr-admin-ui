<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
<!--      <el-form-item label="订单编号" prop="orderSn">-->
<!--        <el-input-->
<!--          v-model="queryParams.orderSn"-->
<!--          placeholder="请输入订单编号"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="用户帐号" prop="memberUsername">
        <el-input
          v-model="queryParams.memberUsername"
          placeholder="请输入用户帐号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="订单总金额" prop="totalAmount">-->
<!--        <el-input-->
<!--          v-model="queryParams.totalAmount"-->
<!--          placeholder="请输入订单总金额"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
      </el-form-item>

      <el-form-item label="支付状态" prop="payType">
        <el-select v-model="queryParams.payType" placeholder="请选择支付方式" clearable>
          <el-option
            v-for="dict in dict.type.user_pay"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择订单状态" clearable>
          <el-option
            v-for="dict in dict.type.pay_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收货人姓名" prop="receiverName">
        <el-input
          v-model="queryParams.receiverName"
          placeholder="请输入收货人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货人电话" prop="receiverPhone">
        <el-input
          v-model="queryParams.receiverPhone"
          placeholder="请输入收货人电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="详细地址" prop="addresssId">-->
<!--        <el-input-->
<!--          v-model="queryParams.addresssId"-->
<!--          placeholder="请输入详细地址"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="订单删除" prop="deleteStatus">
        <el-select v-model="queryParams.deleteStatus" placeholder="请选择订单删除" clearable>
          <el-option
            v-for="dict in dict.type.user_collect"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="支付时间" prop="paymentTime">-->
<!--        <el-date-picker clearable-->
<!--                        v-model="queryParams.paymentTime"-->
<!--                        type="date"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        placeholder="请选择支付时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="发货时间" prop="deliveryTime">-->
<!--        <el-date-picker clearable-->
<!--                        v-model="queryParams.deliveryTime"-->
<!--                        type="date"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        placeholder="请选择发货时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="确认收货时间" prop="receiveTime">-->
<!--        <el-date-picker clearable-->
<!--                        v-model="queryParams.receiveTime"-->
<!--                        type="date"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        placeholder="请选择确认收货时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['order:order:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['order:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['order:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="订单id" align="center" prop="id" />-->
      <el-table-column label="订单id" align="center" width="150" prop="orderSn" />

      <el-table-column label="用户帐号" align="center" prop="memberUsername" />
      <el-table-column label="订单总金额" width="100" align="center" prop="totalAmount" />
      <el-table-column label="应付金额" align="center" prop="payAmount" />
      <el-table-column label="支付方式"  width="130" align="center" prop="payType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_pay" :value="scope.row.payType"/>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pay_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="收货人姓名" align="center" prop="receiverName" />
      <el-table-column label="收货人电话" align="center" prop="receiverPhone" />
<!--      <el-table-column label="详细地址" align="center" prop="address" />-->
      <el-table-column label="订单备注" align="center" prop="note" />
<!--      <el-table-column label="确认收货" align="center" prop="confirmStatus">-->
<!--              -->
<!--      </el-table-column>-->
      <el-table-column label="订单删除" align="center" prop="deleteStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_collect" :value="scope.row.deleteStatus"/>
        </template>
      </el-table-column>

<!--      <el-table-column label="支付时间" align="center" prop="paymentTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.paymentTime) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="发货时间" align="center" prop="deliveryTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.deliveryTime ) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="确认收货时间" align="center" prop="receiveTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.receiveTime) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['order:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['order:order:remove']"
          >删除</el-button>
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

    <!-- 添加或修改用户订单表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单编号"   prop="orderSn">
          <el-input v-model="form.orderSn"  disabled  placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="用户帐号" prop="memberUsername">
          <el-input v-model="form.memberUsername" disabled placeholder="请输入用户帐号" />
        </el-form-item>
        <el-form-item label="订单总金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" disabled  placeholder="请输入订单总金额" />
        </el-form-item>
        <el-form-item label="应付金额" prop="payAmount">
          <el-input v-model="form.payAmount"   disabled placeholder="请输入应付金额" />
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="form.payType" disabled placeholder="请选择支付方式">
            <el-option
              v-for="dict in dict.type.user_pay"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择订单状态">
            <el-option
              v-for="dict in dict.type.pay_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货人姓名" prop="receiverName">
          <el-input v-model="form.receiverName" disabled placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="收货人电话" prop="receiverPhone">
          <el-input v-model="form.receiverPhone" disabled placeholder="请输入收货人电话" />
        </el-form-item>
        <el-form-item label="详细地址" prop="addresssId">
          <el-input v-model="form.addresssId" disabled placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="订单备注" prop="note">
          <el-input v-model="form.note"  disabled type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="订单删除" prop="deleteStatus">
          <el-select v-model="form.deleteStatus" placeholder="请选择订单删除">
            <el-option
              v-for="dict in dict.type.user_collect"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>

<!--        <el-form-item label="支付时间" prop="paymentTime">-->
<!--          <el-date-picker clearable-->
<!--                          v-model="form.paymentTime"-->
<!--                          type="date"-->
<!--                          value-format="yyyy-MM-dd"-->
<!--                          placeholder="请选择支付时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="发货时间" prop="deliveryTime">-->
<!--          <el-date-picker clearable-->
<!--                          v-model="form.deliveryTime"-->
<!--                          type="date"-->
<!--                          value-format="yyyy-MM-dd"-->
<!--                          placeholder="请选择发货时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="确认收货时间" prop="receiveTime">-->
<!--          <el-date-picker clearable-->
<!--                          v-model="form.receiveTime"-->
<!--                          type="date"-->
<!--                          value-format="yyyy-MM-dd"-->
<!--                          placeholder="请选择确认收货时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/shopping/order/order";

export default {
  name: "Order",
  dicts: ['pay_status', 'user_pay', 'user_collect'],
  data() {
    return {
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
      // 用户订单表表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderSn: null,
        memberUsername: null,
        totalAmount: null,
        payAmount: null,
        payType: null,
        status: null,
        receiverName: null,
        receiverPhone: null,
        addresssId: null,
        note: null,
        confirmStatus: null,
        deleteStatus: null,
        useIntegration: null,
        paymentTime: null,
        deliveryTime: null,
        receiveTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // orderSn: [
        //   { required: true, message: "订单编号不能为空", trigger: "blur" }
        // ],
        // memberUsername: [
        //   { required: true, message: "用户帐号不能为空", trigger: "blur" }
        // ],
        // totalAmount: [
        //   { required: true, message: "订单总金额不能为空", trigger: "blur" }
        // ],
        // payAmount: [
        //   { required: true, message: "应付金额不能为空", trigger: "blur" }
        // ],
        // payType: [
        //   { required: true, message: "支付方式不能为空", trigger: "change" }
        // ],
        // status: [
        //   { required: true, message: "订单状态不能为空", trigger: "change" }
        // ],
        // receiverName: [
        //   { required: true, message: "收货人姓名不能为空", trigger: "blur" }
        // ],
        // receiverPhone: [
        //   { required: true, message: "收货人电话不能为空", trigger: "blur" }
        // ],
        // addresssId: [
        //   { required: true, message: "详细地址不能为空", trigger: "blur" }
        // ],
        // note: [
        //   { required: true, message: "订单备注不能为空", trigger: "blur" }
        // ],
        // confirmStatus: [
        //   { required: true, message: "确认收货不能为空", trigger: "blur" }
        // ],
        // deleteStatus: [
        //   { required: true, message: "订单删除不能为空", trigger: "change" }
        // ],
        // useIntegration: [
        //   { required: true, message: "下单时使用的积分不能为空", trigger: "blur" }
        // ],
        // paymentTime: [
        //   { required: true, message: "支付时间不能为空", trigger: "blur" }
        // ],
        // deliveryTime: [
        //   { required: true, message: "发货时间不能为空", trigger: "blur" }
        // ],
        // receiveTime: [
        //   { required: true, message: "确认收货时间不能为空", trigger: "blur" }
        // ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户订单表列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        orderSn: null,
        createTime: null,
        memberUsername: null,
        totalAmount: null,
        payAmount: null,
        payType: null,
        status: null,
        receiverName: null,
        receiverPhone: null,
        addresssId: null,
        note: null,
        confirmStatus: 0,
        deleteStatus: null,
        useIntegration: null,
        paymentTime: null,
        deliveryTime: null,
        receiveTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户订单表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户订单表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除用户订单表编号为"' + ids + '"的数据项？').then(function() {
        return delOrder(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('shopping/order/export', {
        ...this.queryParams
      }, `订单表_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
