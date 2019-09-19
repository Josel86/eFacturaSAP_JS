var CryptoJS = require("crypto-js");

var xml = require('fs').readFileSync('eDocMexicoCFDI.wsdl', 'utf8');

var soap = require('soap');

var http = require('http');

var myService = {
    eDocMexicoCFDI: {
        eDocMexicoCFDISOAP: {
            SubmitEdoc: function(request) {
                var response = {
                    TimbreFiscalDigital: {
                        attributes: {
                            Version: 1.1,
                            UUID: "81EAA288-D866-4C46-8878-FF0FF598126F",
                            FechaTimbrado: "2019-06-20T13:09:05",
                            RfcProvCertif: "TCI100304LC4",
                            SelloCFD: "cOgDvOF+gBqLIOvixlMjQQc53IXGPCSUA/jYi9BsLeo7gyqOi1MC4JWlr0wTmWgTffIQ2u7BXwVthr77e+f31OPo+Beg3WP1KNt4+egGPN844xVPF2pfhv5bOVZpWX/nFlKQLOyiLJcrDO2njsmoQty4YuoA03uug7b8D12NuiNq7/af/FdrnhuKhSOWoy9X3PiyZwAH4EFLPW5NCXBHT6B8mi0BmowOWYLC91ssObSaj6GayYOJaNg/lACCQZtI5zZO2AgmLkTfG23Ve/viqb5wih5JAg2ReA41fP3XVG8f4e0nr6kZcZaCcbWSvb9ANb4qMkTVTHpYn4FYjggngQ==",
                            NoCertificadoSAT: "00001000000406928597",
                            SelloSAT: "YIRerswRj9Kmap0oacqaknfkhzJpdforxYqC8QxE/77hfHkU3cpGNi1VAPdZXBgS5sPOv0Y5S7bW6WMUvvLsc9iuwv41+zmEetSOaJfKhvp7O+S0LN5vUwtbD+szpIp4SDiGv/RweewM0Tb7skfPugciApyAt8FtmbSVxwo0hxnBlkOKeflCimC8hCT8wdIpIf4Glda/htDhLKmStPKKoneW0v3UgUsP+NZkjBhCeXZ7a1es3R9jT7uqB09qcDBMNXakJ1yB5Cbpmuv9DEPRHrQsiBFcHmSILHYbjNFMNErzgV9sQumeTjLaM+LqnoqakMSRNRUzBIYIZwioVs4j2w=="
                        },
                        ResultStatus: 200,
                        Error: {
                            ErrorCode: 200,
                            ErrorDescription: "Error Description"
                        }
                    }
                };
                
                return response;
            },
            GetStatusEdoc: function(request){
                var response = {
                    eDocFoiloResponse: {
                        eDocFolioResult : {
                            attributes: {
                                CodEstatus : 200,
                                Fecha: "2019-09-18T12:00:00",
                                RfcEmisor: "XAXX010101000"
                            },
                            Folios: {
                                UUID: "B2504722-E638-464D-9BBE-7E29F16BD31D",
                                ResultStatus: "Result Status"
                            }
                        }
                    }

                };
                
                return response;
            },
            GetViewEdoc: function(request){
                var response = {
                    eDocFoiloResponse: {
                        eDocFolioResult: {
                            attributes: {
                                CodEstatus : 200,
                                Fecha: "2019-09-18T12:00:00",
                                RfcEmisor: "XAXX010101000"
                            },
                            Folios: {
                                UUID: "B2504722-E638-464D-9BBE-7E29F16BD31D",
                                ResultStatus: "Result Status",
                                ErrorCode: "0",
                                ErrorDescription: "Error Description",
                                DocData: request.DocData
                            }
                        }
                    }                
                };
                
                return response;
            },
            CancelEdoc: function(request){
                //console.log('Este es el payload: ' + request.DocData);
                //var parsedWordArray = CryptoJS.enc.Base64.parse(request.DocData);
                //var parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
                //console.log('Esta es la cadena: ' + parsedStr);

                var response = {
                    eDocFoiloResponse: {
                        eDocFolioResult: {
                            attributes: {
                                CodEstatus : 200,
                                Fecha: "2019-09-18T12:00:00",
                                RfcEmisor: "XAXX010101000"
                            },
                            Folios: {
                                UUID: "B2504722-E638-464D-9BBE-7E29F16BD31D",
                                ResultStatus: "Result Status",
                                ErrorCode: "0",
                                ErrorDescription: "Error Description",
                                DocData: request.DocData
                            }
                        }
                    }                
                };

                return response;
            }
        }
    }
};


//http server
var server = http.createServer(function(request, response) {
    response.end('404: Not Found: ' + request.url);
});

server.listen(8000);

var s = soap.listen(server, '/eDocMexicoCFDI', myService, xml, function(err, res){
  console.log('Server up and ready');
});

//Logs every response and request
s.log = function(type, data) {
    // type is 'received' or 'replied'
    console.log(type + ': ' + data);
};

//Authorize every incoming request to the server
s.authorizeConnection = function(req, res){
    var headers = req.headers;

    if (!headers.authorization || headers.authorization.indexOf('Basic ') === -1) {
        res.statusCode = 401;
        return false;
    }else {
        // verify auth credentials
        var base64Credentials =  headers.authorization.split(' ')[1];
        var credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        var username = credentials.split(':')[0];
        var password = credentials.split(':')[1];

        if(username === "sap" && password === "indicium1*"){
            return true;
        }else{
            res.statusCode = 401;
            return false;
        }
    }
};
