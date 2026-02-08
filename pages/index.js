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
