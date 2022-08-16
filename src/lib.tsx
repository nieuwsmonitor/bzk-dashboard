import { AmcatFilters, AmcatIndex, AmcatQuery } from "amcat4react";

export interface DashboardComponentProp {
    index: AmcatIndex,
    query: AmcatQuery
}

export function addFilters(q: AmcatQuery, filters: AmcatFilters) {
    const result = { ...q.filters, ...filters };
    return { ...q, filters: result };
  }