import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SEARCH } from "@/constants/data-table-constant"
import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import { useReplaceParams } from "./use-replace-param"
import useDebounce from "./use-debounce"
import { parsePositiveInt } from '@/utils/parse-number'

export default function useDatatable() {
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE)
    const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)
    const [search, setSearch] = useState(DEFAULT_SEARCH)

    const sp = useSearchParams()
    const replaceParams = useReplaceParams()
    const debouncedSearch = useDebounce()

    const qRaw = sp.get('q') ?? search
    const pageFromUrl = parsePositiveInt(sp.get('page'), currentPage)
    const limitFromUrl = parsePositiveInt(sp.get('limit'), currentLimit)

    useEffect(() => {
        setCurrentPage(pageFromUrl)
    }, [pageFromUrl])

    useEffect(() => {
        setCurrentLimit(limitFromUrl)
    }, [limitFromUrl])

    useEffect(() => {
        setSearch(qRaw)
    }, [qRaw])

    const handleChangePage = (page: number) => {
        setCurrentPage(page)
        replaceParams({ page })
    }

    const handleChangeLimit = (limit: number) => {
        setCurrentLimit(limit)
        setCurrentPage(DEFAULT_PAGE)
        replaceParams({ limit, page: DEFAULT_PAGE })
    }

    const handleSearch = (value: string | null) => {
        const searchValue = value?.trim() || null

        debouncedSearch(() => {
            setSearch(searchValue ?? '')
            setCurrentPage(DEFAULT_PAGE)
            replaceParams({ q: searchValue, page: DEFAULT_PAGE })
        }, 500)
    }

    return {
        // State values (prioritas ke URL params jika ada)
        currentPage: pageFromUrl,
        currentLimit: limitFromUrl,
        search: qRaw, // Gunakan qRaw untuk real-time input sync

        // Raw URL values
        qRaw,
        page: pageFromUrl,
        limit: limitFromUrl,

        // Handlers
        handleChangePage,
        handleChangeLimit,
        handleSearch,

        // Others or Default
        DEFAULT_LIMIT,
        DEFAULT_PAGE,
        DEFAULT_SEARCH
    }
}