export default function throw_error(error: any): never {
    throw (error._display ?? error.toString())
}