'use strict';

const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserController extends Controller {
  async login() {
    const ctx = this.ctx;
    const { email, password } = ctx.request.body;
    const query = {};
    query.email = email;
    query.password = password;
    const user = await ctx.model.User.findOne(query);
    if (user !== null) {
      user.token = ctx.service.user.createToken({ id: user.id });
      ctx.body = user;
      ctx.status = 201;
    } else {
      ctx.body = {};
      ctx.status = 404;
    }
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.User.findById(toInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const { name, avatar, email, mobile, password, prefix } = ctx.request.body;
    const user = await ctx.model.User.create({ name, avatar, email, mobile, password, prefix });
    ctx.status = 201;
    ctx.body = user;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findById(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    const { name, age } = ctx.request.body;
    await user.update({ name, age });
    ctx.body = user;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findById(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.destroy();
    ctx.status = 200;
  }
}

module.exports = UserController;
