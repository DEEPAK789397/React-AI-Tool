
export function Test(str) {
    return /^(\*)(\*)(.*)\*$/.test(str);
}

export function Result(str) {
    return str.replace(/^(\*)(\*)|(\*)$/g, "");
}
