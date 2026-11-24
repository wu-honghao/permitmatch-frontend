import { describe, expect, it } from 'vitest';
import { buildJobQuery } from '../../utils';

describe('buildJobQuery — 岗位查询参数', () => {
  it('空条件不生成查询参数', () => {
    expect(buildJobQuery({})).toBe('');
    expect(buildJobQuery({ keyword: '  ', location: '\t' })).toBe('');
  });

  it('岗位关键词使用 title 参数并去掉首尾空格', () => {
    const params = new URLSearchParams(buildJobQuery({ keyword: '  React Developer  ' }));
    expect(params.get('title')).toBe('React Developer');
    expect(params.has('keyword')).toBe(false);
  });

  it('地点去空格，并正确编码特殊字符', () => {
    const params = new URLSearchParams(buildJobQuery({ location: ' Cork & Dublin ' }));
    expect(params.get('location')).toBe('Cork & Dublin');
  });

  it('只有明确允许许可支持时才传 true', () => {
    expect(new URLSearchParams(buildJobQuery({ permitSupported: true })).get('permitSupported')).toBe('true');
    expect(new URLSearchParams(buildJobQuery({ permitSupported: false })).has('permitSupported')).toBe(false);
  });

  it('页码、分页大小和排序一起构造', () => {
    const params = new URLSearchParams(buildJobQuery({ page: 2, limit: 20, sort: 'createdAt:desc' }));
    expect(Object.fromEntries(params.entries())).toEqual({ page: '2', limit: '20', sort: 'createdAt:desc' });
  });

  it('0 页码和 0 条数不传参（当前实现口径）', () => {
    expect(buildJobQuery({ page: 0, limit: 0 })).toBe('');
  });

  it('全条件一起构造时不丢失字段', () => {
    const params = new URLSearchParams(buildJobQuery({
      keyword: ' Full Stack ', location: ' Dublin ', permitSupported: true,
      page: 3, limit: 10, sort: 'title',
    }));
    expect(Object.fromEntries(params.entries())).toEqual({
      title: 'Full Stack', location: 'Dublin', permitSupported: 'true', page: '3', limit: '10', sort: 'title',
    });
  });
});
