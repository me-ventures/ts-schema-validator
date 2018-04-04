import { resolve } from "path";
import { Definition } from "typescript-json-schema";
import * as TJS from "typescript-json-schema";

export class SchemaProvider {
    private program: TJS.Program;
    private generator: TJS.JsonSchemaGenerator;
    private cache = new Map<string, Definition|any>();
    private includeReffedDefinitions: boolean;

    constructor(
        params: ISchemaProviderParams
    ) {
        // optionally pass argument to schema generator
        const settings: TJS.PartialArgs = params.settings || {
            required: true,
        };

        // optionally pass ts compiler options
        const compilerOptions: TJS.CompilerOptions = params.compilerOptions || {};

        this.includeReffedDefinitions = !! params.includeReffedDefinitions;

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

    public getSchemaForSymbol( symbol: string ): Definition|any {
        if ( ! this.generator ) {
            throw new Error(
                `no schema generator present`
            );
        }

        if ( ! this.cache.has(symbol) ) {
            const draft06 = this.generator.getSchemaForSymbol(
                symbol,
                this.includeReffedDefinitions
            );

            this.cache.set(symbol, draft06);
        }

        return this.cache.get(symbol);
    }

    public getAllSchemas(): Map<string, Definition|any> {
        const symbols: string[] = this.generator.getUserSymbols();

        return this.getSchemasForSymbols(symbols);
    }

    public getSchemasFilterBySymbol( filterMethod: (symbol: string) => boolean )
        : Map<string, Definition|any>
    {
        const symbols: string[] = this.generator.getUserSymbols()
            .filter(filterMethod);

        return this.getSchemasForSymbols(symbols);
    }

    public getSchemasForSymbols( symbols: string[] ): Map<string, Definition|any> {
        const schemas: Map<string, Definition|any> = new Map();
        for ( const symbol of symbols ) {
            try {
                const schema = this.getSchemaForSymbol(symbol);

                schemas.set(symbol, schema);
            }

            catch ( ex ) {
                throw ex;
            }
        }

        return schemas;
    }
}

export interface ISchemaProviderParams {
    path: string;
    settings ?: TJS.PartialArgs;
    compilerOptions ?: TJS.CompilerOptions;
    includeReffedDefinitions ?: boolean;
}
