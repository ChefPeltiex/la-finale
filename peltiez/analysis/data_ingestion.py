#!/usr/bin/env python3
"""
Download experiment events into a local NDJSON file (HTTP GET or S3).

Examples:
  python data_ingestion.py --url https://collector.example/events.ndjson --out events.ndjson
  python data_ingestion.py --s3-uri s3://bucket/prefix/events.ndjson --out events.ndjson
"""

from __future__ import annotations

import argparse
from typing import BinaryIO


def _download_url(url: str, out: BinaryIO) -> None:
    import requests

    with requests.get(url, stream=True, timeout=120) as r:
        r.raise_for_status()
        for chunk in r.iter_content(chunk_size=64 * 1024):
            if chunk:
                out.write(chunk)


def _download_s3(uri: str, out: BinaryIO) -> None:
    import boto3
    from urllib.parse import urlparse

    p = urlparse(uri)
    if p.scheme != "s3" or not p.netloc or not p.path.lstrip("/"):
        raise SystemExit("s3-uri must look like s3://bucket/key")
    bucket = p.netloc
    key = p.path.lstrip("/")
    boto3.client("s3").download_fileobj(bucket, key, out)


def main() -> int:
    ap = argparse.ArgumentParser(description="Fetch NDJSON event logs for offline analysis.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--url", help="HTTPS URL returning NDJSON body")
    g.add_argument("--s3-uri", dest="s3_uri", help="s3://bucket/object key to download")
    ap.add_argument("--out", required=True, help="Local output path")
    args = ap.parse_args()

    if args.url:
        writer = lambda f: _download_url(args.url, f)
    else:
        writer = lambda f: _download_s3(args.s3_uri, f)

    with open(args.out, "wb") as f:
        writer(f)
    print(f"Wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
