import {assert as Assert } from "chai";
import {} from "mocha";
import {} from "node";
import * as sinon from "sinon";
import { SchemaProvider } from "../../src";

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
    });
});


