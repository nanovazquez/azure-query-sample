using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Microsoft.WindowsAzure;
//using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;
using System.Runtime.Serialization;
using System.Net.Http.Formatting;
using azureQuery;

namespace azureQuery
{
    public class AzureQueryBlobController : ApiController
    {
        #region Containers

        //******************************
        //*                            *
        //*    C O N T A I N E R  S    *
        //*                            *
        //******************************
        // api/blob/container/?c=container-names
        // Retun an array of container descriptions.

        [HttpGet]
        public container[] containers(string c = "" /* container name */)
        {
            if (String.IsNullOrEmpty(c)) c = "*";

            BlobHelper bh = new BlobHelper("default");
            List<container> results = new List<container>();

            string[] containerNames = c.Split(',');
            foreach (string cn in containerNames)
            {
                if (cn == String.Empty || cn.Contains("*")) /* all containers | wildcard */
                {
                    List<CloudBlobContainer> containers = new List<CloudBlobContainer>();

                    bh.ListContainers(out containers);

                    for (int i = containers.Count() - 1; i >= 0; i--)
                    {
                        if (MatchWildcard(cn, containers[i].Name))
                        {
                            results.Add(new container() {
                                name = containers[i].Name,
                                eTag = containers[i].Properties.ETag,
                                timeStamp = containers[i].Properties.LastModifiedUtc.ToString()
                            });
                        }
                    }
                }
                else /* specific containers */
                {
                    CloudBlobContainer cb = bh.GetContainer(cn);
                    if (cb != null)
                    {
                        results.Add(new container() {
                                    name = cb.Name,
                                    eTag = cb.Properties.ETag,
                                    timeStamp = cb.Properties.LastModifiedUtc.ToString()
                        });
                    }
                }
            }

            return results.ToArray();
        }

        
        #endregion

        //*******************
        //*                 *
        //*    B L O B S    *
        //*                 *
        //*******************
        // GET api/blob?c=containers&b=blobs&d=bool
        // Return a list of blobs

        [HttpGet]
        public blob[] blobs(string c /* container */, string b, /* blobs filter */ bool d = false /* include detail */)
        {
            blob blob;
            List<blob> blobs = new List<blob>();

            if (String.IsNullOrEmpty(c))
            {
                c = "*";
            }

            if (String.IsNullOrEmpty(b))
            {
                b = "*";
            }

            BlobHelper bh = new BlobHelper("default");
            List<CloudBlob> blobList = new List<CloudBlob>();

            string[] containerNames;
            if (c == null)
            {
                containerNames = new string[] { "*" };
            }
            else
            {
                containerNames = c.Split(',');
            }

            foreach (string container in containerNames)
            {
                if (container.Contains("*")) /* wildcard - all containers */
                {
                    List<CloudBlobContainer> containers = new List<CloudBlobContainer>();
                    if (bh.ListContainers(out containers))
                    {
                        foreach (CloudBlobContainer ctr in containers)
                        {
                            if (MatchWildcard(container, ctr.Name) &&
                               (bh.ListBlobs(ctr.Name, out blobList)))
                            {
                                foreach (CloudBlob cb in blobList)
                                {
                                    blob = new blob()
                                    {
                                        containerName = ctr.Name,
                                        name = cb.Name,
                                        length = cb.Properties.Length
                                    };

                                    if (MatchWildcard(b, cb.Name))
                                    {
                                        if (d)
                                        {
                                            blob.blobType = cb.Properties.BlobType.ToString();
                                            blob.contentType = cb.Properties.ContentType;
                                            blob.eTag = cb.Properties.ETag;
                                            blob.timeStamp = cb.Properties.LastModifiedUtc.ToString();
                                        };

                                        blobs.Add(blob);
                                    }
                                }
                            }
                        }
                    }

                }
                else
                {
                    if (b.Contains("*"))
                    {
                        if (bh.ListBlobs(container, out blobList))
                        {
                            foreach (CloudBlob cb in blobList)
                            {
                                blob = new blob()
                                {
                                    containerName = container,
                                    name = cb.Name,
                                    length = cb.Properties.Length
                                };

                                if (MatchWildcard(b, cb.Name))
                                {
                                    if (d)
                                    {
                                        blob.blobType = cb.Properties.BlobType.ToString();
                                        blob.contentType = cb.Properties.ContentType;
                                        blob.eTag = cb.Properties.ETag;
                                        blob.timeStamp = cb.Properties.LastModifiedUtc.ToString();
                                    };
                                    blobs.Add(blob);
                                }
                            }
                        }
                    }
                    else
                    {
                        blob = new blob()
                        {
                            containerName = container,
                            name = b,
                            length = 0
                        };

                        SortedList<string, string> properties = new SortedList<string,string>();
                        if (bh.GetBlobProperties(c, b, out properties))
                        {
                            //TODO: blob.length = Convert.ToInt32(properties["Length"]);

                            if (d)
                            {
                                blob.blobType = properties["BlobType"];
                                blob.contentType = properties["ContentType"];
                                blob.eTag = properties["ETag"];
                                blob.timeStamp = properties["LastModified"].ToString();
                            };
                        }

                        blobs.Add(blob);
                    }
                }
            }

            return blobs.ToArray();
        }

        // Gives stack overflow...
        //public CloudBlob[] Get(string c /* container */, bool d = false /* include detail */)
        //{
        //    BlobHelper bh = new BlobHelper("Storage");
        //    List<CloudBlob> blobList = new List<CloudBlob>();
        //    if (bh.ListBlobs(c, out blobList))
        //    {
        //        return blobList.ToArray();
        //    }
        //    else
        //    {
        //        return null;
        //    }
        //}

        #region text - get/put text blob

        //*****************
        //*               *
        //*    T E X T    *
        //*               *
        //*****************
        // GET api/blob/?c=container&b=blob
        // Return a blob as text.

        [HttpGet]
        public string text(string c /* container name */, string b /* blob name */)
        {
            BlobHelper bh = new BlobHelper("default");
            string content = String.Empty;
            bh.GetBlob(c, b, out content);
            return content;
        }

        [HttpPost]
        public void text(textBlob blob)
        {
            BlobHelper bh = new BlobHelper("default");
            bh.PutBlob(blob.containerName, blob.blobName, blob.text);
            return;
        }

        #endregion

        #region bytes - get/put binary blob

        //*******************
        //*                 *
        //*    B Y T E S    *
        //*                 *
        //*******************

        [HttpGet]
        public binaryBlob bytes(string c /* container */, string b /* blob */)
        {
            binaryBlob blob = new binaryBlob();
            BlobHelper bh = new BlobHelper("default");
            byte[] bytes = null;
            bh.GetBlob(c, b, out bytes);
            blob.containerName = c;
            blob.blobName = b;
            if (bytes != null)
            {
                blob.bytesEncoded = Convert.ToBase64String(bytes);
            }
            else
            {
                blob.bytesEncoded = null;
            }
            return blob;
        }

        [HttpPost]
        public void bytes(binaryBlob blob)
        {
            byte[] bytes = Convert.FromBase64String(blob.bytesEncoded);
            BlobHelper bh = new BlobHelper("default");
            bh.PutBlob(blob.containerName, blob.blobName, bytes);
            return;
        }

        #endregion




        // PUT api/values/5
        public void Put(int id, string value)
        {
        }


        //***************************
        //*                         *
        //*    C O N T A I N E R    *
        //*                         *
        //***************************
        // POST api/blob/container
        //Take action on container
        // a=x (exists?), a=c (create), a=r (remove)

        [HttpGet]
        public bool container(string s, string c /* container name */, string a /* action */)
        {
            if (string.IsNullOrEmpty(s)) s = "default";

            BlobHelper bh = new BlobHelper(s);

            switch (a)
            {
                case "x":   // exists?
                    return bh.ContainerExists(c);
                case "c":   // create
                    return bh.CreateContainer(c);
                case "r":   // remove
                    return bh.DeleteContainer(c);
            }

            return false;
        }



        //*****************
        //*               *
        //*    B L O B    *
        //*               *
        //*****************
        // GET api/blob/blob
        //Take action on blob
        // a=x (exists?), a=c (create), a=r (remove)

        [HttpGet]
        public bool blob(string s, string c /* container name */, string b /* blob name */, string a /* action */)
        {
            if (string.IsNullOrEmpty(s)) s = "default";

            BlobHelper bh = new BlobHelper(s);

            switch (a)
            {
                case "x":   // exists?
                    return bh.BlobExists(c, b);
                case "c":   // create
                    return bh.CreateBlob(c, b);
                case "r":   // remove
                    return bh.DeleteBlob(c, b);
            }

            return false;
        }


        //*****************
        //*               *
        //*    C O P Y    *
        //*               *
        //*****************
        // GET api/blob/copy
        // Copy artifact
        // t=c (target c|b) c1=source=container b1=source-blob c2=dest-container b2=dest-blob

        [HttpGet]
        public bool copy(
            string s /* storage account */, 
            string c1 /* source container name */, 
            string b1 /* source blob name */, 
            string c2 /* dest container name */,
            string b2 /* dest blob name */)
        {
            if (string.IsNullOrEmpty(s)) s = "default";

            BlobHelper bh = new BlobHelper(s);

            if (string.IsNullOrEmpty(c2))
            {
                c2 = c1;
            }

            if (string.IsNullOrEmpty(b2))
            {
                b2 = b1;
            }

            if (!string.IsNullOrEmpty(c1))
            {
                if (!string.IsNullOrEmpty(b1))
                {
                    return bh.CopyBlob(c1, b1, c2, b2);
                }
                else
                {
                    return bh.CopyContainer(c1, c2);
                }
            }

            return false;
        }
        
        // DELETE api/blob/delete?c=container
        // Delete container

        [HttpDelete]
        public void delete(string c)
        {
            // TODO: delete container c
        }

        // GET api/blob/textblob/name
        //public string GetTextBlob(string id)
        //{
        //    string blobUrl = id;
        //    return "value";
        //}

        public bool MatchWildcard(string pattern, string value)
        {
            if (String.IsNullOrEmpty(pattern) || pattern == "*") return true;

            if (pattern == value) return true;

            if (pattern.StartsWith("*") && pattern.EndsWith("*"))
            {
                return value.Contains(pattern.Substring(1, pattern.Length-2));
            }
            else if (pattern.StartsWith("*"))
            {
                return value.EndsWith(pattern.Substring(1));
            }
            else if (pattern.EndsWith("*"))
            {
                return value.StartsWith(pattern.Substring(0, pattern.Length - 1));
            }
            else
            {
                return false;
            }
        }
    }


    public class container
    {
        public string name { get; set; }
        public string eTag { get; set; }
        public string timeStamp { get; set; }
    }


    public class blob
    {
        public string containerName { get; set; }
        public string name { get; set; }
        public string blobType { get; set; }
        public string contentType { get; set; }
        public string eTag { get; set; }
        public string timeStamp { get; set; }
        public long length { get; set; }
    }

    public class textBlob
    {
        public string containerName { get; set; }
        public string blobName { get; set; }
        public string text { get; set; }
    }

    public class binaryBlob
    {
        public string containerName { get; set; }
        public string blobName { get; set; }
        public string bytesEncoded { get; set; }
    }

}