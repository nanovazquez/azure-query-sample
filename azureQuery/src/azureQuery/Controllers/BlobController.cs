using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System.Runtime.Serialization;
using System.Net.Http.Formatting;

namespace azureQuery.Controllers
{
    public class BlobController : azureQuery.AzureQueryBlobController { }
}