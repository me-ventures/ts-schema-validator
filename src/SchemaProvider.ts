import { resolve } from "path";
import * as TJS from "typescript-json-schema";
const migrate = require("json-schema-migrate");

export class SchemaProvider {
    private program: TJS.Program;
    private generator: TJS.JsonSchemaGenerator;
    private cache = new Map<string, object>();

    constructor(
        params: ISchemaProviderParams
    ) {
        // optionally pass argument to schema generator
        const settings: TJS.PartialArgs = params.settings || {};

        // optionally pass ts compiler options
        const compilerOptions: TJS.CompilerOptions = params.compilerOptions || {};

        this.program = TJS.getProgramFromFiles([
            resolve(params.path)
        ], compilerOptions);

        this.generator = TJS.buildGenerator(this.program, settings);

        if ( ! this.generator ) {
            throw new Error(
                `could not create schema generator for path ${params.path}`
            );
        }
    }

    public getSchemaForSymbol( symbol: string ): object {
        if ( ! this.generator ) {
            throw new Error(
                `no schema generator present`
            );
        }

        if ( ! this.cache.has(symbol) ) {
            const draft04 = this.generator.getSchemaForSymbol(symbol);
            const draft06 = migrate.draft6(draft04);
            draft06.$schema = "http://json-schema.org/draft-06/schema#";

            this.cache.set(symbol, draft06);
        }

        return this.cache.get(symbol);
    }
}

export interface ISchemaProviderParams {
    path: string;
    settings ?: TJS.PartialArgs;
    compilerOptions ?: TJS.CompilerOptions;
}
