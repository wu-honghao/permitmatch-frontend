import { describe, expect, it } from 'vitest'
import { buildJobQuery } from '../utils'

describe('buildJobQuery', ()=>{
    it("should build title query from keyword", ()=>{
        const result = buildJobQuery({
            keyword: 'React'
        })

        expect(result).toBe('title=React')
    })

    it('should build location query from location',()=>{
        const result = buildJobQuery({
            location: 'Cork'
        })

        expect(result).toBe('location=Cork')
    })

    it('should build permitSupported query from permitSupported true',()=>{
        const result = buildJobQuery({
            permitSupported: true
        })

        expect(result).toBe('permitSupported=true')
    })

    it('should not include permitSupported when false',()=>{
        const result = buildJobQuery({
            permitSupported: false
        })

        expect(result).toBe('')
    })

    it('should build page and limit to query',()=>{
        const result = buildJobQuery({
            page: 1,
            limit: 10
        })

        expect(result).toBe('page=1&limit=10')
    })

    it('should build mixed to query',()=>{
        const result = buildJobQuery({
            keyword: 'React',
            location: 'Dublin',
            permitSupported: true,
            page: 1,
            limit: 10
        })

        expect(result).toBe('title=React&location=Dublin&permitSupported=true&page=1&limit=10')
        expect(result).toContain('title=React')
        expect(result).toContain('location=Dublin')
        expect(result).toContain('permitSupported=true')
        expect(result).toContain('page=1')
        expect(result).toContain('limit=10')
    })
})