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

            Assert.isArray(schema.required);
            Assert.equal(schema.required.length, 3);
            Assert.deepEqual(schema.required, [
                "booleanThing",
                "numberThing",
                "stringThing"
            ]);
        });

        it(`should get a schema for a given symbol with optionals`, async function(){
            const sut = new SchemaProvider({
                path: "test/samples/ISampleInterfaceWithOptionals.ts"
            });

            const schema: object|any = sut.getSchemaForSymbol("ISampleInterfaceWithOptionals");

            Assert.isObject(schema);
            Assert.equal(schema.$schema, "http://json-schema.org/draft-06/schema#");
            Assert.equal(schema.properties.booleanThing.type, "boolean");
            Assert.equal(schema.properties.numberThing.type, "number");
            Assert.equal(schema.properties.stringThing.type, "string");

            Assert.isArray(schema.required);
            Assert.equal(schema.required.length, 1);
            Assert.deepEqual(schema.required, [
                "stringThing"
            ]);
        });

        // @todo: figure out how we atcually want this to work (technically works right now, but not really..)
        it(`should get a schema for a given symbol using es6 features`, async function(){
            const compilerOptions = require(resolve("tsconfig.json")).compilerOptions;

            const sut = new SchemaProvider({
                path: "test/samples/ISampleInterfaceWithEs6Features.ts",
                compilerOptions: compilerOptions,
            });

            const schema: object|any = sut.getSchemaForSymbol("ISampleInterfaceWithEs6Features");

            Assert.isObject(schema);
            Assert.equal(schema.$schema, "http://json-schema.org/draft-06/schema#");
            Assert.equal(schema.properties.booleanThing.type, "boolean");
            Assert.equal(schema.properties.numberThing.type, "number");
            Assert.equal(schema.properties.stringThing.type, "string");
        });
    });
});


