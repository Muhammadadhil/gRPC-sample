const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");


const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../protos/course.proto"));
const courseProto = grpc.loadPackageDefinition(packageDefinition);

const COURSE = [
    {
        id: 100,
        CourseId: 1000,
        title: "Engineering",
        major: "Electronics",
    },
    {
        id: 200,
        CourseId: 2000,
        title: "Engineering",
        major: "Computer Science",
    },
    {
        id: 300,
        CourseId: 3000,
        title: "Engineering",
        major: "Telecommunication",
    },
    {
        id: 400,
        CourseId: 4000,
        title: "Commerce",
        major: "Accounts",
    },
];

function findCourse(call, callback) {
    let course=COURSE.find((course)=> course.CourseId == call.request.id);
    console.log('course:',course);
    
    if(course){
        callback(null,course);
    }else{
        callback({
            message: 'Course not found',
            code: grpc.status.INVALID_ARGUMENT
        });
    }
}

const server=new grpc.Server();

server.addService(courseProto.Courses.service, ({find: findCourse}));

server.bindAsync('0.0.0.0:50051',grpc.ServerCredentials.createInsecure(),()=> {
    server.start();
})
