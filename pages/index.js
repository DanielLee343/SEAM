import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>SEAM: Secure and Practical Endpoint Address Merging</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="SEAM: A practical hardware defense that securely restores memory sharing by modifying only the memory controller." />
      </Head>

      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-inner">
          <span className="navbar-title">SEAM</span>
          <div className="navbar-links">
            <a href="#motivation">Motivation</a>
            <a href="#approach">Approach</a>
            <a href="#evaluation">Evaluation</a>
            <a href="#download">Download</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>SEAM</h1>
        <p className="subtitle">Secure and Practical Endpoint Address Merging</p>
        <div className="abstract">
          <p>
            Memory sharing across jobs enables reuse-based side channels that leak private information,
            forcing cloud providers to disable sharing entirely. Prior hardware defenses require modifying
            many CPU components (L1/L2 caches, LLC, coherence directory, MMU, and memory controller),
            making practical adoption difficult.
          </p>
          <p>
            <strong style={{ color: '#93c5fd' }}>SEAM</strong> reduces the total hardware modifications needed for
            comprehensive protection against both cache and memory reuse-based side channels down
            to <strong style={{ color: '#93c5fd' }}>just one</strong> &mdash; the memory controller. We prototype SEAM on a real system
            and demonstrate it securely restores memory sharing with negligible performance overhead.
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
            SEAM delays merging unique addresses into a shared address until the very end &mdash; when
            the request reaches memory. This eliminates reuse-based cache side channels without
            modifying any caches.
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
                <img src="/intro-pcss.png" alt="SEAM: unique in cache, shared at memory endpoint" />
              </div>
              <div className="label">(c) SEAM (Ours)</div>
              <div className="caption">
                Jobs use unique addresses in cache. The MC merges them to shared addresses
                at the memory endpoint. Only the MC needs modification.
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
                  <td>SEAM (Ours)</td>
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
              SEAM reduces modifications from 7 components down to just 2 (MC + OS).
            </p>
          </div>
          {/* OS Procedures */}
          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>OS Modifications</h3>
          <p style={{ color: '#4b5563' }}>
            SEAM requires only minimal OS changes, confined to page allocation and deallocation.
            We modify Linux kernel 5.10.235 with just 500 lines of code.
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
            it encodes the PTE using SEAM rather than directly sharing the physical address.
          </p>
          <div className="procedure-descriptions">
            <p>
              In the KSM merge path (<code>replace_page</code>), when a page is being shared across cgroups,
              SEAM initializes a per-page <code>page_cgroup_vector</code> (the use_tracker from Procedure 1)
              using a lock-free compare-and-swap. It then calls <code>try_inc_page_usecount_v2()</code>,
              which scans the vector, builds the intermediate bit vector of in-use group member IDs, and either
              increments the map_count for an existing cgroup entry or creates a new one with a randomly
              chosen group_member_id &mdash; exactly following Procedure 1.
            </p>
            <p>
              When encoding is triggered (i.e., a second cgroup maps the same page), the PTE is
              set to the sharing-only PPN using the
              formula: <code>enc_pfn = (pfn - base_pfn) &times; group_size + end_cxl_pfn + encode_idx</code>.
              A special PTE bit (bit 52, <code>_PAGE_SEAM_ENCODE</code>) marks the PTE as encoded, so the
              kernel can transparently decode it back to the regular PPN on access and unmap.
              Notably, the cgroup_id is obtained from the owning process (<code>mm-&gt;owner</code>), not
              from <code>current</code>, since KSM runs as a kernel thread (ksmd).
            </p>
          </div>

          {/* Patch File List */}
          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>Patch Overview</h3>
          <p style={{ color: '#4b5563' }}>
            The kernel patch adds 3 new files and modifies 7 existing files. Below is a summary of
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
                Core implementation of the per-page use_tracker (~305 lines). Implements the logic
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
                Core SEAM logic (~300 lines). Encodes PTEs for file-backed pages
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
              <code className="file-path">arch/x86/include/asm/pgtable_types.h</code>
              <span className="file-desc">
                Defines <code>_PAGE_BIT_SEAM_ENCODE</code> (bit 52) and adds it
                to the PTE change mask so the kernel recognizes encoded PTEs.
              </span>
            </div>
            <div className="file-item">
              <code className="file-path">mm/khugepaged.c</code>
              <span className="file-desc">
                Adds <code>SCAN_PAGE_ENCODED</code> result code. Skips SEAM-encoded
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

      {/* Evaluation Section */}
      <div className="section-alt" id="evaluation">
        <div className="section">
          <h2>Evaluation</h2>
          <p className="section-intro">
            We prototype SEAM on a real system with an FPGA-based CXL memory controller and a 32-core
            Intel EMR Gold 6530 CPU, running a modified Linux kernel 5.10.235. This is the very first
            real-system prototype of hardware protection against reuse side channels.
          </p>

          <h3 style={{ color: '#1e3a5f', marginBottom: '0.5rem' }}>Security: Access Latency Distribution</h3>
          <p style={{ color: '#4b5563' }}>
            We measure the cumulative distribution of 100 million memory access latencies. Without SEAM,
            &ldquo;With Sharing&rdquo; and &ldquo;Without Sharing&rdquo; show clearly separable latency peaks &mdash; revealing the
            side channel. With SEAM, the two distributions become indistinguishable (KS test p-value = 0.83).
          </p>

          <div className="eval-grid">
            <div className="eval-item">
              <img src="/cdf_clean_no_seam.png" alt="CDF of access latency without SEAM" />
              <div className="label">Without SEAM</div>
              <div className="caption">
                Two distinct peaks clearly separate &ldquo;With Sharing&rdquo; vs.
                &ldquo;Without Sharing&rdquo; &mdash; the reuse-based side channel is exploitable.
              </div>
            </div>
            <div className="eval-item">
              <img src="/cdf_clean_seam.png" alt="CDF of access latency with SEAM" />
              <div className="label">With SEAM</div>
              <div className="caption">
                The latency distributions become indistinguishable &mdash; the side channel
                is completely eliminated.
              </div>
            </div>
          </div>

          <h3 style={{ color: '#1e3a5f', marginTop: '3rem', marginBottom: '0.5rem' }}>Performance Results</h3>
          <p style={{ color: '#4b5563' }}>
            We evaluate SEAM across DNN inference, TPC-H database queries, OpenSSL, SPEC CPU 2017,
            and PARSEC benchmarks running in containers.
          </p>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">+3%</div>
              <div className="stat-label">
                Avg. performance improvement over disabling memory sharing (current practice)
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">&lt;0.8%</div>
              <div className="stat-label">
                Avg. slowdown vs. an idealization of prior hardware defenses (while being far simpler)
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1.3 GB</div>
              <div className="stat-label">
                Avg. memory saved with 8 containers (out of 4.8 GB total footprint)
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">0.05%</div>
              <div className="stat-label">
                Flush+Reload success rate with SEAM (= random guessing: 1/2048)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="download-section" id="download">
        <h2>Download</h2>
        <p>
          SEAM is implemented as a Linux kernel patch (500 lines of code on kernel 5.10.235)
          with modifications confined to page allocation and deallocation paths.
        </p>
        <a href="/seam_v5.10.235.patch" download className="download-btn">
          Download Kernel Patch
        </a>
      </div>

      {/* Footer */}
      <footer className="footer">
        SEAM: Secure and Practical Endpoint Address Merging
      </footer>
    </>
  )
}
