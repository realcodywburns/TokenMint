export function gotoTab(id, params = null) {
    return {
        type: 'TAB/OPEN',
        id,
        params,
    };
}
