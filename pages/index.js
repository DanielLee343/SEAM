import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>CPM: Non-intrusive Cache Side Channel Protection Near Memory</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="CPM: A non-intrusive hardware defense that protects against reuse-based cache side channels by placing all protection logic inside the memory controller." />
      </Head>

      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-inner">
          <span className="navbar-title">CPM</span>
          <div className="navbar-links">
            <a href="#motivation">Motivation</a>
            <a href="#approach">Approach</a>
            <a href="#generality">Generality</a>
            <a href="#evaluation">Evaluation</a>
            <a href="#download">Download</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>CPM</h1>
        <p className="subtitle">Non-intrusive Cache Side Channel Protection Near Memory</p>
        <p className="venue">MICRO 2026 &middot; Athens, Greece</p>
        <div className="abstract">
          <p>
            Memory sharing across security domains enables reuse-based side channels that leak non-shared data,
            forcing data centers to disable sharing entirely &mdash; and contradicting a main goal of cloud computing:
            boosting cost efficiency via resource sharing. Prior hardware defenses require modifications spread
            across L1/L2 caches, the LLC, coherence directory, MMU, and memory controller. Such widespread
            changes are intrusive and have, so far, prevented real-world use.
          </p>
          <p>
            <strong style={{ color: '#93c5fd' }}>CPM</strong> is a non-intrusive design that achieves global
            (i.e., all caches + memory) protection through <strong style={{ color: '#93c5fd' }}>local changes to a single
            component</strong> &mdash; the memory controller. Real-system evaluations on a high-end Intel server
            demonstrate secure <em>elimination</em> of cache reuse side channels across containers, VMs, and
            host processes, despite only modifying the MC.
          </p>
        </div>
      </section>

      {/* Motivation Section */}
      <div className="section-alt" id="motivation">
        <div className="section">
          <h2>Motivation</h2>
          <p className="section-intro">
            Identical code and data historically share the same physical pages in memory. But memory sharing
            opens up reuse-based side channels that can leak sensitive information.
          </p>

          <div className="motivation-grid">
            <div className="motivation-card">
              <h3>The Problem: Side Channels</h3>
              <p>
                When jobs share physical addresses, an attacker can detect a victim&apos;s access behavior
                through cache timing differences (e.g., Flush+Reload) or DRAM row buffer hits.
                These reuse-based side channels are alias-free and highly accurate.
              </p>
            </div>
            <div className="motivation-card">
              <h3>Current Practice: No Sharing</h3>
              <p>
                Cloud providers (AWS, Google Cloud, Azure) disable memory sharing across
                jobs (VMs, containers) to prevent these attacks. This wastes significant memory
                by duplicating identical pages.
              </p>
            </div>
            <div className="motivation-card">
              <h3>Prior Defenses: Too Complex</h3>
              <p>
                Prior hardware defenses modify L1 caches, L2 caches, LLC, coherence directory, MMU,
                and memory controller &mdash; making practical adoption and deployment extremely difficult.
                No such defense has ever been deployed in a real system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approach Section */}
      <div id="approach">
        <div className="section">
          <h2>Our Approach</h2>
          <p className="section-intro">
            CPM delays merging unique addresses into a shared address until the very end &mdash; when
            the request leaves the cache hierarchy and arrives at the memory controller. This places
            all protection <em>near memory</em>, eliminating reuse-based cache side channels without
            modifying any cache.
          </p>

          <div className="key-idea">
            <strong>Key Observation:</strong> A level in the cache/memory hierarchy requires hardware protection
            only if it uses shared addresses. The fewer levels that use shared addresses, the fewer
            hardware components must be modified.
          </div>

          {/* Three approach figures */}
          <div className="approach-grid">
            <div className="approach-item">
              <div className="figure-wrapper">
                <img src="/intro-nosharing.png" alt="Current system: no sharing" />
              </div>
              <div className="label">(a) Current System Deployment</div>
              <div className="caption">
                Cloud providers disable sharing. Each job uses unique physical addresses.
                Memory is wasted due to duplication.
              </div>
            </div>
            <div className="approach-item">
              <div className="figure-wrapper">
                <img src="/intro-nonsecure-sharing.png" alt="Prior defenses: shared addresses with hardware defenses" />
              </div>
              <div className="label">(b) Prior Hardware Defenses</div>
              <div className="caption">
                Jobs use shared addresses. Both caches and memory controller must be
                fortified with hardware defenses.
              </div>
            </div>
            <div className="approach-item">
              <div className="figure-wrapper highlight-card">
                <img src="/intro-pcss.png" alt="CPM: unique in cache, shared at memory endpoint" />
              </div>
              <div className="label">(c) CPM (Ours)</div>
              <div className="caption">
                Jobs use unique addresses in cache. The MC merges them into a shared address
                right before data reaches DRAM. Only the MC needs modification.
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Approach</th>
                  <th>MC</th>
                  <th>LLC</th>
                  <th>L2 Caches</th>
                  <th>L1 Caches</th>
                  <th>Cache Dir</th>
                  <th>MMU</th>
                  <th>OS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prior Hardware Defenses</td>
                  <td><span className="cross">&#x2716;</span></td>
                  <td><span className="cross">&#x2716;</span></td>
                  <td><span className="cross">&#x2716;</span></td>
                  <td><span className="cross">&#x2716;</span></td>
                  <td><span className="cross">&#x2716;</span></td>
                  <td><span className="cross">&#x2716;</span></td>
                  <td><span className="cross">&#x2716;</span></td>
                </tr>
                <tr>
                  <td>CPM (Ours)</td>
                  <td><span className="cross">&#x2716;</span></td>
                  <td><span className="dash">&mdash;</span></td>
                  <td><span className="dash">&mdash;</span></td>
                  <td><span className="dash">&mdash;</span></td>
                  <td><span className="dash">&mdash;</span></td>
                  <td><span className="dash">&mdash;</span></td>
                  <td><span className="cross">&#x2716;</span></td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <span className="cross">&#x2716;</span> = requires modification, <span className="dash">&mdash;</span> = no change needed.
              CPM reduces modifications from 7 components down to just 2 (MC + OS) &mdash; and leaves the entire core pipeline untouched.
            </p>
          </div>

          {/* Hardware Modifications */}
          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>
            Hardware Modifications
          </h3>

          <p style={{ color: '#4b5563' }}>
            We implemented merging logic in the hardware side of a CXL Type-3 Device
            design example. This design is built on the Terasic Mercury A2700 Accelerator
            Card, which integrates an Intel Agilex 7 FPGA with on-board DRAM. The system
            consists of a host server connected over PCIe/CXL to the FPGA device. Inside
            the FPGA, the CXL IP interfaces with an Accelerator Functional Unit (AFU),
            which in turn connects to the Memory Controller (MC) and DRAM through AXI.
            This setup allows the device to behave as a memory expansion unit exposed to
            the host.
          </p>

          <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '1.5rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src="/hardware-architecture.png"
              alt="Hardware Architecture and AFU Modifications"
              style={{
                borderRadius: '0.75rem'
              }}
            />
            <div
              style={{
                marginTop: '0.75rem',
                color: '#6b7280',
                fontSize: '0.9rem',
                textAlign: 'center',
                maxWidth: '500px'
              }}
            >
              Hardware architecture of the CXL Type-3 FPGA device and the location of
              the implemented AFU modifications.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src="/afu-merging-logic.png"
              alt="Detailed AFU Merging Logic"
              style={{
                borderRadius: '0.75rem'
              }}
            />
            <div
              style={{
                marginTop: '0.75rem',
                color: '#6b7280',
                fontSize: '0.9rem',
                textAlign: 'center',
                maxWidth: '500px'
              }}
            >
              Detailed AFU implementation showing interception and remapping of AXI
              address signals before forwarding requests to the memory controller.
            </div>
          </div>
        </div>

          <p style={{ color: '#4b5563', marginTop: '1.5rem' }}>
            Our focus is on modifying the AFU. Specifically, we implemented merging logic
            only on the AXI address paths namely, <code>awaddr</code> (write address
            channel) and <code>araddr</code> (read address channel). All other AXI signals
            (W, B, R channels and non-address signals in AW/AR) are passed through
            unchanged. The merging logic remaps incoming addresses before they reach the
            memory controller.
          </p>

          <h4
            style={{
              color: '#1e3a5f',
              marginTop: '2rem',
              marginBottom: '0.75rem'
            }}
          >
            Implemented Merging Module
          </h4>

          <div
            style={{
              background: '#e4f3e3',
              color: '#000000',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              overflowX: 'auto',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}
          >
            <pre
              style={{
                margin: 0,
                whiteSpace: 'pre-wrap'
              }}
          >{`module cpm_merging #(parameter N = 52 )(
    input  logic [(N-1):0] signal_in,
    output logic [(N-1):0] signal_out
);

localparam logic [N-1:0] BASE_ADDR   = 52'h2080000000; // 130 GB
localparam logic [N-1:0] UPPER_BOUND = 52'h247FFFFFFF; // 130 + 16 GB
localparam logic [11:0] MOD_MASK     = 12'hFFF; // mask for 4KB

always_comb begin
    if (signal_in > UPPER_BOUND) begin
        signal_out =
            (((signal_in - UPPER_BOUND) >> 17) << 12) +
            BASE_ADDR + (signal_in & MOD_MASK);
    end
    else begin
        signal_out = signal_in;
    end
end

endmodule`}</pre>
          </div>

          <p style={{ color: '#4b5563', marginTop: '1.5rem' }}>
            Here <code>BASE_ADDR</code> is the address from where the CXL-attached memory
            starts. Therefore, <code>UPPER_BOUND</code> represents the physical end
            address of the CXL-attached memory region.
          </p>

          <h4
            style={{
              color: '#1e3a5f',
              marginTop: '2rem',
              marginBottom: '0.75rem'
            }}
          >
            Address Transformation
          </h4>

          <div
            style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              color: '#111827',
              overflowX: 'auto',
              textAlign: 'center',
              fontFamily: 'monospace'
            }}
          >
            MergedAddr = [(addr - upperbound_addr) / (4K * group_size)] * 4K +
            base_addr + addr % 4K
          </div>

          <p style={{ color: '#4b5563', marginTop: '1.5rem' }}>
            In short, we intercept only the read/write address signals in the AFU, apply
            the merging/remapping logic, and forward the modified addresses to the memory
            controller while leaving the rest of the AXI data path untouched.
          </p>
          {/* OS Procedures */}
          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>OS Modifications</h3>
          <p style={{ color: '#4b5563' }}>
            CPM requires only minimal OS changes, confined to page allocation and deallocation.
            We modify Linux kernel 5.10.235 with roughly 900 lines of code.
          </p>

          <div className="eval-grid">
            <div className="eval-item">
              <img src="/procedure1.png" alt="Procedure 1: Additional Action during Page Mapping" />
            </div>
            <div className="eval-item">
              <img src="/procedure2.png" alt="Procedure 2: Additional Action during Page Unmapping" />
            </div>
          </div>

          <div className="procedure-descriptions">
            <p>
              <strong>Procedure 1</strong> presents the new actions during the page mapping procedure.
              During page mapping, the kernel first scans the page&apos;s use_tracker to check if the current
              cgroup is already tracked. During the scan, it also builds an intermediate bit vector representing
              all group_member_id values currently in use by other cgroups (line 6).
              If an entry for the mapping cgroup already exists (line 7), its map_count is simply
              incremented (line 8), and the existing group_member_id is reused.
              If no entry is found, a new one is created: a new group_member_id is chosen randomly from
              the slots not marked in the bit vector (line 12), and a new triplet is added to the use_tracker
              with its map_count initialized to one (line 13).
              Finally, when installing the PTE, if use_tracker contains more than one entry, we allocate a
              sharing-only PPN using the group_member_id (line 16); otherwise, the regular PPN is
              used (line 19).
            </p>
            <p>
              <strong>Procedure 2</strong> describes the new actions during the page unmapping procedure.
              When unmapping, Procedure 2 first flushes the associated cache lines (line 2) and then
              calculates the regular PPN (line 3). It then scans through the corresponding use_tracker to
              find a match of that process&apos;s cgroup_id. Once found, Procedure 2 decrements the
              map_count (line 7), and deletes the element from use_tracker (line 9) if the count reaches zero.
            </p>
          </div>

          {/* KSM Integration */}
          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>KSM Integration</h3>
          <p style={{ color: '#4b5563' }}>
            Linux&apos;s <strong>Kernel Same-page Merging (KSM)</strong> scans memory for identical pages and merges
            them to save memory. We modify KSM so that when it merges pages across different cgroups,
            it encodes the PTE using CPM rather than directly sharing the physical address.
          </p>
          <div className="procedure-descriptions">
            <p>
              In the KSM merge path (<code>replace_page</code>), when a page is being shared across cgroups,
              CPM initializes a per-page <code>page_cgroup_vector</code> (the use_tracker from Procedure 1)
              using a lock-free compare-and-swap. It then calls <code>try_inc_page_usecount_v2()</code>,
              which scans the vector, builds the intermediate bit vector of in-use group member IDs, and either
              increments the map_count for an existing cgroup entry or creates a new one with a randomly
              chosen group_member_id &mdash; exactly following Procedure 1.
            </p>
            <p>
              When encoding is triggered (i.e., a second cgroup maps the same page), the PTE is
              set to the sharing-only PPN using the
              formula: <code>enc_pfn = (pfn - base_pfn) &times; group_size + end_cxl_pfn + encode_idx</code>.
              A special PTE bit (bit 52, <code>_PAGE_CPM_ENCODE</code>) marks the PTE as encoded, so the
              kernel can transparently decode it back to the regular PPN on access and unmap.
              Notably, the cgroup_id is obtained from the owning process (<code>mm-&gt;owner</code>), not
              from <code>current</code>, since KSM runs as a kernel thread (ksmd).
            </p>
          </div>

          {/* Patch File List */}
          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>Patch Overview</h3>
          <p style={{ color: '#4b5563' }}>
            The kernel patch adds 3 new files and modifies 10 existing files. Below is a summary of
            every file the patch touches and its role.
          </p>

          <h4 style={{ color: '#1e3a5f', marginTop: '1.5rem', marginBottom: '0.75rem' }}>New Files</h4>
          <div className="file-list">
            <div className="file-item file-item-new">
              <code className="file-path">include/linux/encode_common.h</code>
              <span className="file-desc">
                Shared data structures: <code>page_cgroup_triplet</code> (4-byte packed struct
                with cgroup_id, encode_idx, map_count), <code>page_cgroup_vector</code> (resizable
                array with spinlock + RCU), and global configuration variables (base_pfn, group_size,
                end_cxl_pfn).
              </span>
            </div>
            <div className="file-item file-item-new">
              <code className="file-path">include/linux/page_cgroup_vector.h</code>
              <span className="file-desc">
                API header declaring vector operations: init, try_inc_page_usecount,
                reset_page_usecount, free, and debug print.
              </span>
            </div>
            <div className="file-item file-item-new">
              <code className="file-path">mm/page_cgroup_vector.c</code>
              <span className="file-desc">
                Core implementation of the per-page use_tracker (~546 lines). Implements the logic
                from Procedures 1 and 2: linear scan, bitvector construction, random bit selection,
                map_count increment/decrement, and RCU-safe element deletion.
              </span>
            </div>
          </div>

          <h4 style={{ color: '#1e3a5f', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Modified Files</h4>
          <div className="file-list">
            <div className="file-item">
              <code className="file-path">mm/memory.c</code>
              <span className="file-desc">
                Core CPM logic (~300 lines). Encodes PTEs for file-backed pages
                in <code>alloc_set_pte()</code>, decodes in <code>vm_normal_page()</code>,
                handles unmap cleanup in <code>vm_normal_page_seam()</code>.
                Also adds CLWB/CLFLUSH cache writeback, a debugfs control
                interface, and a helper to get a task&apos;s cgroup_id.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">mm/ksm.c</code>
              <span className="file-desc">
                KSM integration. In <code>replace_page()</code>, initializes the
                page_cgroup_vector via lock-free cmpxchg, encodes PTEs when merging
                pages across cgroups, using <code>mm-&gt;owner</code> for cgroup_id.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">include/linux/mm_types.h</code>
              <span className="file-desc">
                Adds <code>page_cgroup_vector*</code> pointer to <code>struct page</code>,
                enabling per-page tracking of which cgroups share the page.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">include/linux/rmap.h</code>
              <span className="file-desc">
                Adds a new <code>PVMW_CPM_DECODE</code> flag (bit 2) to the
                <code>page_vma_mapped_walk</code> API so reverse-mapping walks can
                request decoding of CPM-encoded PTEs when resolving a PFN.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">mm/page_vma_mapped.c</code>
              <span className="file-desc">
                In <code>check_pte()</code>, decodes the PFN via
                <code>seam_decode_pfn()</code> when <code>PVMW_CPM_DECODE</code> is set.
                Only the unmap path opts in; page_referenced/page_mkclean skip decoding
                to avoid PTL contention.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">mm/rmap.c</code>
              <span className="file-desc">
                In <code>try_to_unmap_one()</code>, sets <code>PVMW_CPM_DECODE</code>,
                decodes the encoded PFN for correct subpage computation, and
                decrements <code>num_ksm_coded</code> when reclaim clears an
                encoded KSM PTE.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">arch/x86/include/asm/pgtable_types.h</code>
              <span className="file-desc">
                Defines <code>_PAGE_BIT_CPM_ENCODE</code> (bit 52) and adds it
                to the PTE change mask so the kernel recognizes encoded PTEs.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">mm/khugepaged.c</code>
              <span className="file-desc">
                Adds <code>SCAN_PAGE_ENCODED</code> result code. Skips CPM-encoded
                pages during huge page collapse to avoid corrupting encoded PTEs.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">drivers/nvdimm/nd.h</code>
              <span className="file-desc">
                Increases <code>MAX_STRUCT_PAGE_SIZE</code> from 64 to 80 bytes to
                accommodate the new page_cgroup_vector pointer in struct page.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">mm/Makefile</code>
              <span className="file-desc">
                Adds <code>page_cgroup_vector.o</code> to the build.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generality Section */}
      <div id="generality">
        <div className="section">
          <h2>Generality</h2>
          <p className="section-intro">
            The same table-free merging hardware extends to multiple practical scenarios with
            minimal changes.
          </p>
          <div className="motivation-grid">
            <div className="motivation-card">
              <h3>Multi-socket Systems</h3>
              <p>
                On two-socket servers that partition the physical address space into two halves,
                CPM instantiates the merging formula per socket &mdash; each socket&apos;s sharing-only
                PPNs stay within its own half of the address range, preserving existing NUMA
                and interleaving behavior.
              </p>
            </div>
            <div className="motivation-card">
              <h3>Huge Pages</h3>
              <p>
                Current systems share memory at 4 KB granularity. CPM extends naturally to 2 MB huge
                pages by merging only the most significant PPN bits and routing 4 KB vs. 2 MB pages
                through disjoint address ranges, so page size is conveyed by the address alone.
              </p>
            </div>
            <div className="motivation-card">
              <h3>Conflict Side Channels</h3>
              <p>
                Although CPM targets reuse-based channels, the same MC merging logic can randomly
                remap virtual pages to different sharing-only PPNs &mdash; cheaply lowering bandwidth
                of conflict-based channels without OS-driven page migration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Section */}
      <div className="section-alt" id="evaluation">
        <div className="section">
          <h2>Evaluation</h2>
          <p className="section-intro">
            We prototype CPM on a high-end server with a 32-core Intel EMR Gold 6530 CPU and an
            FPGA-based CXL memory controller (16 GB on-board), running a modified Linux kernel 5.10.235.
            This is the very first real-system prototype of hardware protection against reuse-based
            side channels. We evaluate across LLM inference (Llama3.2, Gemma3, Qwen2.5), DNN image
            classification, TPC-H queries on SQLite, OpenSSL, SPEC CPU 2017, and PARSEC.
          </p>

          <h3 style={{ color: '#1e3a5f', marginBottom: '0.5rem' }}>Security: Flush+Reload Across Six Scenarios</h3>
          <p style={{ color: '#4b5563' }}>
            We run a publicly available Flush+Reload attack where the victim uses a secret index
            (512 out of 1024 128B elements) to touch a shared array. We repeat the attack across
            three sharing boundaries (containers, VMs via KSM, and bare-metal host in separate cgroups)
            and two core placements (attacker and victim on the same physical core vs. different cores)
            &mdash; six total scenarios. In every scenario, the attacker reliably recovers the correct
            secret <em>except</em> when CPM is turned on.
          </p>

          <div className="attack-grid">
            <div className="eval-item">
              <img src="/security-attack-container-remote-core.png" alt="Container, different cores" />
              <div className="label">Container, different cores</div>
            </div>
            <div className="eval-item">
              <img src="/security-attack-vm-remote-core.png" alt="VM, different cores" />
              <div className="label">VM, different cores</div>
            </div>
            <div className="eval-item">
              <img src="/security-attack-host-remote-core.png" alt="Host, different cores" />
              <div className="label">Host, different cores</div>
            </div>
            <div className="eval-item">
              <img src="/security-attack-container-local-core.png" alt="Container, same core" />
              <div className="label">Container, same core</div>
            </div>
            <div className="eval-item">
              <img src="/security-attack-vm-local-core.png" alt="VM, same core" />
              <div className="label">VM, same core</div>
            </div>
            <div className="eval-item">
              <img src="/security-attack-host-local-core.png" alt="Host, same core" />
              <div className="label">Host, same core</div>
            </div>
          </div>

          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>Security: Access Latency Distribution</h3>
          <p style={{ color: '#4b5563' }}>
            We measure the cumulative distribution of 100 million memory access latencies. Without CPM,
            &ldquo;With Sharing&rdquo; and &ldquo;Without Sharing&rdquo; show clearly separable latency peaks &mdash; revealing
            the reuse side channel. With CPM, the two distributions become indistinguishable
            (Kolmogorov-Smirnov test p-value = 0.83).
          </p>

          <div className="eval-grid">
            <div className="eval-item">
              <img src="/cdf_clean_no_seam.png" alt="CDF of access latency without CPM" />
              <div className="label">Without CPM</div>
              <div className="caption">
                Two distinct peaks clearly separate &ldquo;With Sharing&rdquo; vs.
                &ldquo;Without Sharing&rdquo; &mdash; the reuse-based side channel is exploitable.
              </div>
            </div>
            <div className="eval-item">
              <img src="/cdf_clean_seam.png" alt="CDF of access latency with CPM" />
              <div className="label">With CPM</div>
              <div className="caption">
                The latency distributions become indistinguishable &mdash; the side channel
                is completely closed.
              </div>
            </div>
          </div>

          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>Performance &amp; Memory Saving</h3>
          <p style={{ color: '#4b5563' }}>
            Compared to the deployed practice of turning off memory sharing, CPM restores sharing
            <em> while</em> running faster on average, and dramatically raises VM density on a fixed
            memory budget.
          </p>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">+2.2%</div>
              <div className="stat-label">
                Avg. performance improvement over disabling memory sharing (today&apos;s cloud practice)
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">&lt;2%</div>
              <div className="stat-label">
                Worst-case slowdown on real workloads vs. normal sharing; LLMs are the outlier at ~10%
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">13 vs. 5</div>
              <div className="stat-label">
                VMs co-located in 16 GB CXL memory: CPM vs. turning sharing off (LLM/DNN/TPC-H avg.)
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0.05%</div>
              <div className="stat-label">
                Flush+Reload success rate under CPM (= random guessing, 1/2048)
              </div>
            </div>
          </div>

          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>Sensitivity: VM Density &amp; Sharing-only PPNs</h3>
          <p style={{ color: '#4b5563' }}>
            To stress VM density, we co-locate instances of LLM, DNN, and SQLite workloads on the
            16 GB CXL memory. Turning off sharing caps the server at roughly 5 VMs on average;
            CPM fits about 13 &mdash; a 2.6&times; increase &mdash; and scales by dynamically allocating
            sharing-only PPNs (each saves 4 KB).
          </p>

          <div className="eval-grid">
            <div className="eval-item">
              <img src="/evaluation-more-vms.png" alt="Max VMs co-located on 16GB CXL" />
              <div className="label">Max VMs co-located on 16 GB CXL</div>
              <div className="caption">
                Turning off sharing vs. CPM, across LLM, DNN, and TPC-H workloads.
              </div>
            </div>
            <div className="eval-item">
              <img src="/evaluation-sharing-only-ppns.png" alt="Sharing-only PPNs allocated" />
              <div className="label">Sharing-only PPNs allocated</div>
              <div className="caption">
                Peak sharing-only PPN count at max VM density &mdash; each saves 4 KB of memory.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="download-section" id="download">
        <h2>Download</h2>
        <p>
          CPM is implemented as a Linux kernel patch (~900 lines of code on kernel 5.10.235)
          with modifications confined to page allocation and deallocation paths.
        </p>
        <a href="/seam_v5.10.235.patch" download className="download-btn">
          Download Kernel Patch
        </a>
      </div>

      {/* Footer */}
      <footer className="footer">
        CPM: Non-intrusive Cache Side Channel Protection Near Memory &middot; MICRO 2026
      </footer>
    </>
  )
}
