
sync.sh:
	deno run --allow-write --allow-read cmd/mirrorer/main.ts g sync.sh

.PHONY: README.md
README.md:
	cat README.stub.md > README.md
	echo >> README.md
	cat  CHANGELOG.md >> README.md
	echo >> README.md
