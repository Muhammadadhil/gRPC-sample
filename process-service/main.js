const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../protos/processing.proto"));
const processingProto = grpc.loadPackageDefinition(packageDefinition);

function process(call) {
    let onboardRequest = call.request;
    let time = onboardRequest.orderId * 1000 + onboardRequest.courseId * 10;
    call.write({ status: 0 });
    call.write({ status: 1 });
    setTimeout(() => {
        call.write({ status: 2 });
        setTimeout(() => {
            call.write({ status: 3 });
            call.end();
        }, time);
    }, time);
}

const server = new grpc.Server();
server.addService(processingProto.Processing.service, { process });
server.bindAsync("0.0.0.0:50052", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
