/**
 * Created with IntelliJ IDEA.
 * User: Dan Shreim
 * Date: 6/18/14
 * Time: 3:47 PM
 * To change this template use File | Settings | File Templates.
 */

describe('hello-protractor', function(){

    var ptor = protractor.getInstance();

    describe('index', function(){

        it ("Should display the correct title", function(){
            ptor.get('/demo/#/');
            expect(ptor.getTitle()).toBe('ngCart')
        })


    });

})