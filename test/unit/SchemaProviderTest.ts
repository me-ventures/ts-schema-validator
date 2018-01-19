import {assert as Assert } from "chai";
import {} from "mocha";
import {} from "node";
import * as sinon from "sinon";
import * as TJS from "typescript-json-schema";
import { SchemaProvider } from "../../src/SchemaProvider";

describe(`SchemaProvider`, function(){
    describe(`getSchemaForSymbol`, function() {
        it(`should get a schema for a given symbol`, function(){
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
    });
});


