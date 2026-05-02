from __future__ import annotations

import asyncio

from anyio.to_thread import run_sync

from src.storage.files import create_read_url, delete_file, file_exists
from src.storage.files import _get_s3_bucket, _get_s3_client, _is_s3_storage


TEST_KEY = "_smoke-tests/r2-storage-check.txt"


async def main() -> None:
    if not _is_s3_storage():
        raise RuntimeError("Set STORAGE_BACKEND=s3 before running this test.")

    def put_test_object() -> None:
        _get_s3_client().put_object(
            Bucket=_get_s3_bucket(),
            Key=TEST_KEY,
            Body=b"family-slideshow-r2-smoke-test",
            ContentType="text/plain",
        )

    await run_sync(put_test_object)

    if not await file_exists(TEST_KEY):
        raise RuntimeError("Uploaded test object was not found in R2.")

    signed_url = create_read_url(TEST_KEY)
    print("R2 upload verified.")
    print(f"Signed read URL: {signed_url}")

    await delete_file(TEST_KEY)

    if await file_exists(TEST_KEY):
        raise RuntimeError("Test object still exists after delete.")

    print("R2 delete verified.")


if __name__ == "__main__":
    asyncio.run(main())
