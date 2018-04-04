import {assert as Assert } from "chai";
import {} from "mocha";
import {} from "node";
import * as sinon from "sinon";
import { Definition } from "typescript-json-schema";
import { SchemaProvider } from "../../src";
import { ISampleInterfaceWithEs6Features } from "../samples/ISampleInterfaceWithEs6Features";
import { resolve } from "path";
import { ISampleInterfaceOne } from "../samples/ISampleMultipleInterfaces";

describe(`SchemaProvider`, function(){
    this.timeout(30000);

    describe(`getSchemaForSymbol`, function() {
        it(`should get a schema for a given symbol`, async function(){
            const sut = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema: Definition|any = sut.getSchemaForSymbol("ISampleInterface");

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

            const schema: Definition|any = sut.getSchemaForSymbol("ISampleInterfaceWithOptionals");

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

            const schema: Definition|any = sut.getSchemaForSymbol("ISampleInterfaceWithEs6Features");

            Assert.isObject(schema);
            Assert.equal(schema.$schema, "http://json-schema.org/draft-06/schema#");
            Assert.equal(schema.properties.booleanThing.type, "boolean");
            Assert.equal(schema.properties.numberThing.type, "number");
            Assert.equal(schema.properties.stringThing.type, "string");
        });
    });

    describe(`getSchemasFilterBySymbol`, function(){
        it(`should filter symbols and return a map of all schemas present in the given path`, async function(){
            const sut = new SchemaProvider({
                path: "test/samples/ISampleMultipleInterfaces.ts"
            });

            const schemas: Map<string, Definition|any> = sut.getSchemasFilterBySymbol(x => {
                return x.startsWith("ISample");
            });


            Assert.equal(schemas.size, 3);

            const sampleOne = schemas.get("ISampleInterfaceOne");
            const sampleTwo = schemas.get("ISampleInterfaceTwo");
            const sampleThree = schemas.get("ISampleInterfaceThree");

            Assert.isObject(sampleOne);
            Assert.equal(sampleOne.properties.hello.type, "string");

            Assert.isObject(sampleTwo);
            Assert.equal(sampleTwo.properties.nihao.type, "string");
            Assert.equal(sampleTwo.properties.aNumberOptional.type, "number");

            Assert.isObject(sampleThree);
            Assert.equal(sampleThree.properties.bonjour.type, "string");
            Assert.equal(sampleThree.properties.aBoolean.type, "boolean");
        });
    });

    // @todo: figure out why this spits out a bunch of junk in the console (and/or how to fix/suppress it)
    // describe(`getAllSchemas`, function(){
    //     it(`should return a map of all schemas present in the given path`, async function(){
    //         const sut = new SchemaProvider({
    //             path: "test/samples/ISampleMultipleInterfaces.ts"
    //         });
    //
    //         const schemas: Map<string, Definition|any> = sut.getAllSchemas();
    //
    //         const sampleOne = schemas.get("ISampleInterfaceOne");
    //         const sampleTwo = schemas.get("ISampleInterfaceTwo");
    //         const sampleThree = schemas.get("ISampleInterfaceThree");
    //
    //         Assert.isObject(sampleOne);
    //         Assert.equal(sampleOne.properties.hello.type, "string");
    //
    //         Assert.isObject(sampleTwo);
    //         Assert.equal(sampleTwo.properties.nihao.type, "string");
    //         Assert.equal(sampleTwo.properties.aNumberOptional.type, "number");
    //
    //         Assert.isObject(sampleThree);
    //         Assert.equal(sampleThree.properties.bonjour.type, "string");
    //         Assert.equal(sampleThree.properties.aBoolean.type, "boolean");
    //     });
    // });
});


