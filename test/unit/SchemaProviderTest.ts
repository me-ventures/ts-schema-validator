import {assert as Assert } from "chai";
import {} from "mocha";
import {} from "node";
import * as sinon from "sinon";
import { SchemaProvider } from "../../src";
import { ISampleInterfaceWithEs6Features } from "../samples/ISampleInterfaceWithEs6Features";
import { resolve } from "path";

describe(`SchemaProvider`, function(){
    this.timeout(30000);

    describe(`getSchemaForSymbol`, function() {
        it(`should get a schema for a given symbol`, async function(){
            const sut = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema: object|any = sut.getSchemaForSymbol("ISampleInterface");

            Assert.isObject(schema);
            Assert.equal(schema.$schema, "http://json-schema.org/draft-06/schema#");
            Assert.equal(schema.properties.booleanThing.type, "boolean");
            Assert.equal(schema.properties.numberThing.type, "number");
            Assert.equal(schema.properties.stringThing.type, "string");
        });

        // @todo: make this test work (es6 features / compilerOptions)
        // it(`should get a schema for a given symbol using es6 features`, async function(){
        //     const compilerOptions = require(resolve("tsconfig.json")).compilerOptions;
        //
        //     const sut = new SchemaProvider({
        //         path: "test/samples/ISampleInterfaceWithEs6Features.ts",
        //         compilerOptions: compilerOptions,
        //     });
        //
        //     const schema: object|any = sut.getSchemaForSymbol("ISampleInterfaceWithEs6Features");
        //
        //     Assert.isObject(schema);
        //     Assert.equal(schema.$schema, "http://json-schema.org/draft-06/schema#");
        //     Assert.equal(schema.properties.booleanThing.type, "boolean");
        //     Assert.equal(schema.properties.numberThing.type, "number");
        //     Assert.equal(schema.properties.stringThing.type, "string");
        // });
    });
});


