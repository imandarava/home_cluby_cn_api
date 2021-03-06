'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {
  async index() {
    try {
      const ctx = this.ctx;
      const account_type = ctx.query.account_type;
      if (!account_type) {
        throw new Error('account_type参数错误');
      }
      const { remark, amount_type, date } = ctx.query;
      const query = {};
      query.account_type = account_type;
      if (remark) {
        query.remark = remark;
      }

      if (amount_type) {
        query.amount_type = amount_type;
      }

      if (date) {
        query.date = date;
      }
      const user_id = ctx.state.user.id;
      const { currentPage, pageSize } = ctx.helper.pagingParam(ctx.query);
      const result = await ctx.service.account.index(user_id, query, currentPage, pageSize);
      ctx.body = result;
    } catch (error) {
      this.ctx.helper.error(this.ctx, 404, error.message);
    }
  }

  /**
   * 添加
   */

  async create() {
    try {
      const ctx = this.ctx;
      const input = ctx.request.body;
      const user_id = ctx.state.user.id;
      await ctx.service.account.create(user_id, input);
      const account_type = input.account_type;
      if (!account_type) {
        throw new Error('account_type参数错误');
      }
      const query = {};
      query.account_type = account_type;
      const { currentPage, pageSize } = ctx.helper.pagingParam(ctx.query);
      const result = await ctx.service.account.index(user_id, query, currentPage, pageSize);
      ctx.body = result;
    } catch (error) {
      this.ctx.helper.error(this.ctx, 404, error.message);
    }

  }

  async update() {
    try {
      const ctx = this.ctx;
      const input = ctx.request.body;
      const user_id = ctx.state.user.id;

      if (!input.id) {
        throw new Error('id参数错误');
      }

      await ctx.service.account.update(user_id, input);
      const account_type = input.account_type;
      if (!account_type) {
        throw new Error('account_type参数错误');
      }
      const query = {};
      query.account_type = account_type;
      const { currentPage, pageSize } = ctx.helper.pagingParam(ctx.query);
      const result = await ctx.service.account.index(user_id, query, currentPage, pageSize);
      ctx.body = result;
    } catch (error) {
      this.ctx.helper.error(this.ctx, 404, error.message);
    }

  }
}
module.exports = AccountController;
