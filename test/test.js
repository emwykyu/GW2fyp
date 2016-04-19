    /**
     * Created by Emwykyu on 17/04/2016.
     */

    var supertest = require("supertest");
    var should = require("should");

    // This agent refers to PORT where program is runninng.

    var server = supertest.agent("http://localhost:3000");

    // UNIT test begin

    describe("SAMPLE unit test",function(){

        // #1 should return home page

        it("should return home page",function(done){

            // calling home page api
            server
                .get("/")
                .expect("Content-type",/json/)
                .expect(302) // This is HTTP response
                .end(function(err,res){
                    // HTTP status should be 200
                    res.status.should.equal(302);
                    // Error key should be false.
                    res.body.error.should.equal(false);
                    done();
                });
        });

    });


    describe("Unit Testing Examples", function() {

        beforeEach(angular.mock.module('App'));

        it('should have a LoginCtrl controller', function() {
            expect(App.LoginCtrl).toBeDefined();
        });

        it('should have a working LoginService service', inject(['LoginService',
            function(LoginService) {
                expect(LoginService.isValidEmail).not.to.equal(null);

                // test cases - testing for success
                var validEmails = [
                    'test@test.com',
                    'test@test.co.uk',
                    'test734ltylytkliytkryety9ef@jb-fe.com'
                ];

                // test cases - testing for failure
                var invalidEmails = [
                    'test@testcom',
                    'test@ test.co.uk',
                    'ghgf@fe.com.co.',
                    'tes@t@test.com',
                    ''
                ];
                // you can loop through arrays of test cases like this
                for (var i in validEmails) {
                    var valid = LoginService.isValidEmail(validEmails[i]);
                    expect(valid).toBeTruthy();
                }
                for (var i in invalidEmails) {
                    var valid = LoginService.isValidEmail(invalidEmails[i]);
                    expect(valid).toBeFalsy();
                }

            }])
        );
    });


